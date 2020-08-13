const knex = require("../libraries/knex");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const config = require("../.env");
const { BadRequest, NotFound } = require("../libraries/error");
const { resources } = require("../constants");
const { tables } = require("../constants");
const Repository = require("./repository");
const Mailer = require("../libraries/nodemailer");
const locales = require("../../frontend/src/locales.json");

const allowed = {
  conditions: ["username", "email"],
  select: ["username", "realname", "profile"],
  insert: [],
  update: ["username", "realname", "email", "password", "profile"],
};

class model extends Repository {
  cook(key, value) {
    switch (key) {
      case "password":
        return bcrypt.hashSync(value, 10);

      default:
        return value;
    }
  }

  findMany(conditions) {
    if (typeof conditions === "object" && "query" in conditions) {
      return knex(this.table)
        .select(allowed.select)
        .whereRaw("username ilike ? or realname ilike ?", [
          "%" + conditions.query + "%",
          "%" + conditions.query + "%",
        ])
        .orderByRaw("length(username)")
        .offset(0)
        .limit(20);
    }
  }

  /**
   * Sign Up
   * @param {object} first param
   */
  async signup({ username, email, password }) {
    username = typeof username === "string" ? username.toLocaleLowerCase() : "";

    if (username.length < 3 || username.length > 32) {
      throw new BadRequest([{ username: "Username length must be between 3 and 32 characters" }]);
    } else if (!/^[a-z0-9]+$/i.test(username)) {
      throw new BadRequest([{ username: "Username may only contain alphanumeric characters" }]);
    }

    // Username already used?
    const unameExist = await this.findOne(
      { username },
      {
        conditions: ["username"],
        select: ["username"],
      }
    );
    if (unameExist) {
      throw new BadRequest([{ username: `Username ${username} is not available` }]);
    }

    email = validator.normalizeEmail(email);
    // Email already used?
    const emailExist = await this.findOne(
      { email },
      {
        conditions: ["email"],
        select: ["username"],
      }
    );
    if (emailExist) {
      throw new BadRequest([{ email: "Email is invalid or already taken" }]);
    }

    // TODO: check if email not confirmed, send activation link again
    // TODO: some other checks
    let entity = await this.insert(
      {
        username,
        realname: username,
        email,
        password,
        confirmation_code: uuid.v4(),
        confirmation_code_at: new Date(),
      },
      {
        select: ["username", "email", "realname", "profile", "role", "confirmation_code"],
        insert: ["username", "email", "password", "confirmation_code", "confirmation_code_at"],
      }
    );
    entity = entity[0];

    if (!entity) {
      throw new Unauthorized("Invalid signing up");
    }

    // TODO: notify throught rabbit
    Mailer.send({
      template: "verify-email",
      message: {
        to: `"${username}" <${entity.email}>`,
      },
      locals: {
        name: username,
        email,
        brand: locales.en.translation.Brand,
        action_url: `${config.client.url}/${resources.auth.verify}/${entity.confirmation_code}`,
        contacts_url: resources.contacts
          ? `${config.client.url}/${resources.contacts}/`
          : config.client.url,
      },
    })
      .then((result) => {})
      .catch(console.error);

    return entity;
  }

  /**
   * Update
   * @param {object} conditions
   * * @param {object} values to update
   */
  async update(conditions = {}, values = {}) {
    if (!this.user) {
      return;
    }
    conditions = { ...conditions, username: this.user.username };

    const keys = Object.keys(values);

    // Update username
    if (keys.includes("username")) {
      const username =
        typeof values.username === "string" ? values.username.toLocaleLowerCase() : "";

      if (username.length < 3 || username.length > 32) {
        throw new BadRequest([{ username: "Username length must be between 3 and 32 characters" }]);
      } else if (!/^[a-z0-9]+$/i.test(username)) {
        throw new BadRequest([{ username: "Username may only contain alphanumeric characters" }]);
      }
      // Username already used?
      const unameExist = await this.findOne({ username });
      if (unameExist) {
        throw new BadRequest([{ username: `Username ${username} is not available` }]);
      }

      values = { username };

      const fullname = this.user.realname || this.user.username;
      // TODO: notify throught rabbit
      Mailer.send({
        template: "username-changed",
        message: {
          to: `"${fullname}" <${this.user.email}>`,
        },
        locals: {
          name: fullname,
          brand: locales.en.translation.Brand,
          password_reset_url: `${config.client.url}/${resources.auth.reset}/`,
          contacts_url: `${config.client.url}/${resources.contacts}/`,
        },
      })
        .then((result) => {})
        .catch(console.error);
    }

    // Update password
    else if (
      keys.includes("password") &&
      keys.includes("password_new") &&
      keys.includes("password_confirm")
    ) {
      if (values.password_new !== values.password_confirm) {
        throw new BadRequest([{ password_confirm: "Confirm password doesn't match" }]);
      }

      const userWithPassword = await this.findOne(conditions, {
        select: ["username", "realname", "password", "profile"],
      });

      const same = bcrypt.compareSync(values.password, userWithPassword.password);
      if (!same) {
        throw new BadRequest([{ password: `Incorrect current password` }]);
      }

      values = { password: values.password_new };

      const fullname = this.user.realname || this.user.username;
      // TODO: notify throught rabbit
      Mailer.send({
        template: "password-changed",
        message: {
          to: `"${fullname}" <${this.user.email}>`,
        },
        locals: {
          name: fullname,
          brand: locales.en.translation.Brand,
          password_reset_url: `${config.client.url}/${resources.auth.reset}/`,
          contacts_url: `${config.client.url}/${resources.contacts}/`,
        },
      })
        .then((result) => {})
        .catch(console.error);
    }
    if (keys.includes("email")) {
    }
    return super.update(conditions, values);
  }

  async forgot(conditions) {
    let entity = await this.findOne(conditions, {
      conditions: ["username", "email"],
      select: ["username", "realname", "email", "reset_code", "reset_at"],
    });

    if (!entity) {
      return;
    }

    this.user = entity;

    // TODO: check for 3 hours reset_at, do nothing if presented and show resend
    let expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() - 3);

    // if nulls ot reset-at greater than 3 hours
    if (!entity.reset_code || !entity.reset_at || new Date(entity.reset_at) < expiredAt) {
      // Generate reset-code
      // Set freshed reset-at
      // Put into db
      entity = await super.update(
        conditions,
        {
          reset_code: uuid.v4(),
          reset_at: new Date(),
        },
        {
          select: ["username", "realname", "email", "reset_code", "reset_at"],
          update: ["reset_code", "reset_at"],
        }
      );
      entity = entity[0];

      if (!entity) {
        return;
      }
    }

    const fullname = entity.realname || entity.username;

    // TODO: notify throught rabbit
    Mailer.send({
      template: "password-reset",
      message: {
        to: `"${fullname}" <${entity.email}>`,
      },
      locals: {
        name: fullname,
        brand: locales.en.translation.Brand,
        password_reset_form: `${config.client.url}/${resources.auth.reset}/${entity.reset_code}`,
        password_reset_url: `${config.client.url}/${resources.auth.reset}/`,
      },
    })
      .then((result) => {})
      .catch(console.error);

    return entity;
  }

  /**
   * Update users password by reset_code
   * @param {object} conditions
   * @param {object} values
   */
  async reset(conditions, values) {
    if (values.password1 !== values.password2) {
      throw new BadRequest([{ password2: "Confirm password doesn't match" }]);
    }
    const entity = await this.findOne(conditions, {
      conditions: ["reset_code"],
      select: ["username", "realname", "email", "reset_code", "reset_at"],
    });

    if (!entity) {
      throw new NotFound("Verification code not found");
    }

    // TODO: check for 3 hours expiration reset_at, do nothing if expired
    let expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() - 3);

    // if nulls ot reset-at greater than 3 hours
    if (!entity.reset_code || !entity.reset_at || new Date(entity.reset_at) < expiredAt) {
      throw new BadRequest([
        {
          verification_code: `Expired verification code. Verification codes expire after 3 hours`,
        },
      ]);
    }

    return super.update(
      conditions,
      { password: values.password1, reset_code: null, reset_at: null },
      {
        update: ["password", "reset_code", "reset_at"],
      }
    );
  }

  /**
   * Verify users email by confirmation_code
   * @param {object} conditions
   */
  async verify(conditions) {
    const entity = await this.findOne(conditions, {
      conditions: ["confirmation_code"],
      select: ["username", "realname", "email", "confirmation_code", "confirmation_code_at"],
    });

    if (!entity) {
      throw new NotFound("Verification code not found");
    }

    // TODO: check for 3 hours expiration reset_at, do nothing if expired
    let expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() - 3);

    // if nulls ot reset-at greater than 3 hours
    if (
      !entity.confirmation_code ||
      !entity.confirmation_code_at ||
      new Date(entity.confirmation_code) < expiredAt
    ) {
      throw new BadRequest([
        {
          verification_code: `Expired verification code. Verification codes expire after 3 hours`,
        },
      ]);
    }

    // TODO: send welcome mail

    return super.update(
      conditions,
      { confirmation_code: null, confirmation_code_at: null },
      {
        update: ["password", "confirmation_code", "confirmation_code_at"],
      }
    );
  }
}

module.exports = new model({
  table: tables.users,
  allowed,
});
