const validator = require("validator");
const knex = require("../libraries/knex");
const { tables, lengths, tapeEvents } = require("../constants");
const Repository = require("./repository");
const { BadRequest } = require("../libraries/error");
const allowed = {
  schema: ["id", "dialog_id", "created_at", "updated_at", "owner_id", "body", "reply_id"],
  conditions: ["id", "dialog_id"],
  select: ["id", "dialog_id", "created_at", "updated_at", "body", "reply_id"],
  insert: ["dialog_id", "owner_id", "body", "reply_id"],
  update: ["body", "updated_at"],
};
const { publisher } = require("../libraries/ioredis");

class model extends Repository {
  async findMany(conditions) {
    if (!this.user) {
      return;
    }
    if (!"dialog_id" in conditions) {
      throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
    }
    const { dialog_id, offset } = conditions;
    if (!validator.isNumeric(dialog_id)) {
      throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
    }
    if (!validator.isNumeric(offset) || offset < 0 || offset > Number.MAX_VALUE) {
      throw new BadRequest([{ offset: "Bad offset" }]);
    }
    const dialog = await knex(tables.members)
      .select("dialog_id")
      .where({ dialog_id, user_id: this.user.id })
      .first();
    if (!dialog) {
      return;
    }
    const records = await knex(this.table)
      .select(allowed.select.map((c) => `${this.table}.${c}`))
      .select({ owner: `${tables.users}.username` })
      .leftJoin(tables.users, `${tables.users}.id`, `${this.table}.owner_id`)
      .where({ dialog_id: dialog.dialog_id })
      .orderBy(`${this.table}.created_at`, "desc")
      .offset(offset)
      .limit(this.limit);
    return records;
  }

  async findOne(conditions) {
    if (!this.user) {
      return;
    }
    const { id } = conditions;
    if (!validator.isNumeric(id)) {
      throw new BadRequest([{ id: "Bad id" }]);
    }

    const isMessage = await knex(this.table).select(["id", "dialog_id"]).where({ id }).first();
    if (!isMessage) {
      throw new BadRequest([{ id: "Bad id" }]);
    }

    const isMember = await knex(tables.members)
      .select(["user_id"])
      .where({ dialog_id: isMessage.dialog_id, user_id: this.user.id })
      .first();
    if (!isMember) {
      throw new BadRequest([{ id: "Bad id" }]);
    }

    return knex(this.table)
      .select(allowed.select.map((c) => `${this.table}.${c}`))
      .select({ owner: `${tables.users}.username` })
      .leftJoin(tables.users, `${tables.users}.id`, `${this.table}.owner_id`)
      .where({ [`${this.table}.id`]: id })
      .first();
  }

  async insert({ dialog_id, username, message, reply_id }) {
    let dialog;
    if (typeof message !== "string") {
      throw new BadRequest([{ message: "Bad message" }]);
    }
    if (message.trim().length < lengths.message.min && message.length > lengths.message.max) {
      throw new BadRequest([
        {
          message: `Message length must be between ${lengths.message.min} and ${lengths.message.max} characters`,
        },
      ]);
    }
    if (username && !dialog_id) {
      username = typeof username === "string" ? username.toLocaleLowerCase() : "";
      if (username.length < lengths.username.min || username.length > lengths.username.max) {
        throw new BadRequest([
          {
            username: `Username length must be between ${lengths.username.min} and ${lengths.username.max} characters`,
          },
        ]);
      } else if (!/^[a-z0-9]+$/i.test(username)) {
        throw new BadRequest([{ username: "Username may only contain alphanumeric characters" }]);
      }

      const participant = await knex(tables.users)
        .select(["id", "username"])
        .where({ username })
        .first();

      if (!participant) {
        throw new BadRequest([{ username: `Username ${username} is not exist` }]);
      }
      // Check on duplicate end to end dialogs if we only have username and dialog_id is undefined
      /**
       * explain (analyze)
       * select m2.*
       * from members as m1
       * left join members as m2 on m1.dialog_id = m2.dialog_id and m2.dialog_type='direct'
       * where m1.dialog_type='direct' and m1.user_id=1151 and m2.user_id=1132;
       */
      dialog = await knex
        .select({ dialog_id: "m2.dialog_id" })
        .from(`${tables.members} as m1`)
        .leftJoin(`${tables.members} as m2`, (builder) => {
          builder.on("m1.dialog_id", "m2.dialog_id").andOn("m2.dialog_type", knex.raw("'direct'"));
        })
        .where("m2.dialog_type", knex.raw("'direct'"))
        .whereRaw("?? = ?", ["m1.user_id", this.user.id])
        .whereRaw("?? = ?", ["m2.user_id", participant.id])
        .first();

      if (dialog) {
        // throw because we try to create new dialog with new user, but dialog is exists
        // it means that we need to send dialog_id instead just username
        throw new BadRequest([{ username: "Dialog with this username exist" }]);
      }

      // TODO: impl transactional solution
      /**
       * const trx = await knex.transaction();
       * dialog_id = await trx(tables.dialogs)
       * .insert({ member_count: 2 })
       * .returning(["id"])
       * .then(async (dialog) => {
       *   const dialog_id = dialog[0].id;
       *   await trx(tables.members).insert([
       *     { dialog_id, user_id: this.user.id, role: "admin" },
       *     { dialog_id, user_id: participant.id, role: "admin" },
       *   ]);
       *   return dialog_id;
       * })
       * .then(trx.commit)
       * .catch(trx.rollback);
       */
      dialog = await knex(tables.dialogs).insert({ member_count: 2 }).returning(["id"]);
      dialog_id = dialog[0].id;
      // both user is admin in direct conversation
      const members = [
        { dialog_id, user_id: this.user.id, role: "admin" },
        { dialog_id, user_id: participant.id, role: "admin" },
      ];
      await knex(tables.members).insert(members);
    } else if (dialog_id) {
      if (!validator.isNumeric(dialog_id)) {
        throw new BadRequest([{ dialog_id: "Bad dialog_id" }]);
      }
      if (reply_id && !validator.isNumeric(reply_id)) {
        throw new BadRequest([{ reply_id: "Bad reply_id" }]);
      }
      dialog = await knex(tables.dialogs).select(["id"]).where({ id: dialog_id }).first();
      if (!dialog) {
        throw new BadRequest([{ dialog: "Bad dialog" }]);
      }
    } else {
      throw new BadRequest([{ values: "Bad command" }]);
    }

    const toInset = {
      dialog_id,
      body: message,
      owner_id: this.user.id,
    };
    if (reply_id) {
      toInset.reply_id = reply_id;
    }
    const result = await super.insert(toInset);
    if (result) {
      publisher.publish(tapeEvents.message_created, JSON.stringify(result[0]));
      return result;
    }
  }

  async update(conditions, values) {
    const { id } = conditions;
    const { message } = values;

    // check message id
    if (!validator.isNumeric(id)) {
      throw new BadRequest([{ id: "Bad message id" }]);
    }
    if (typeof message !== "string") {
      throw new BadRequest([{ message: "Bad message" }]);
    }
    if (message.trim().length < lengths.message.min && message.length > lengths.message.max) {
      throw new BadRequest([
        {
          message: `Message length must be between ${lengths.message.min} and ${lengths.message.max} characters`,
        },
      ]);
    }

    // 1. is message exist
    const isMessage = await knex(this.table)
      .select(["id", "dialog_id", "owner_id"])
      .where(conditions)
      .first();
    if (!isMessage) {
      return;
    }

    // 2. if message owner than we can edit message
    if (isMessage.owner_id !== this.user.id) {
      throw new BadRequest([{ owner: "Only owner can edit message" }]);
    }

    const result = await super.update({ id }, { updated_at: knex.fn.now(6), body: message });
    if (result) {
      publisher.publish(tapeEvents.message_changed, JSON.stringify(result[0]));
      return result;
    }
  }

  /**
   * Delete record
   * @param {number} conditions - query object conditions
   */
  async del(conditions) {
    const { id } = conditions;
    if (!validator.isNumeric(id)) {
      throw new BadRequest([{ id: "Bad message id" }]);
    }

    // 1. is message exist
    const isMessage = await knex(this.table)
      .select(["id", "dialog_id", "owner_id"])
      .where(conditions)
      .first();
    if (!isMessage) {
      return;
    }

    // 2. if message owner than we can remove message without any other checks or
    if (isMessage.owner_id !== this.user.id) {
      // 3. is current user be a dialog member
      const { dialog_id } = isMessage;
      const isMember = await knex(tables.members)
        .select(["role"])
        .where({ dialog_id, user_id: this.user.id })
        .first();

      if (!isMember) {
        throw new BadRequest([{ id: "Bad message id" }]);
      }

      // 4. is user has access rights to delete message ?
      const { role } = isMember;
      if (role !== "admin") {
        throw new BadRequest([{ role: "User should have admin role" }]);
      }
    }
    // TODO: deal with unread_cursor & unread_counter
    const result = await knex(this.table).where(conditions).del();
    if (Number.isInteger(result) && result > 0) {
      publisher.publish(tapeEvents.message_removed, JSON.stringify(isMessage));
    }
    return result;
  }
}

module.exports = new model({
  table: tables.messages,
  allowed,
});
