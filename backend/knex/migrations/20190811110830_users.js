const { tables, roles, lengths } = require("../../constants");

exports.up = (knex) =>
  knex.schema
    .createTable(tables.users, (t) => {
      t.increments("id").unsigned().primary().comment("ID");

      t.dateTime("created_at").notNull().defaultTo(knex.fn.now(6)).comment("Created at date");
      t.dateTime("updated_at").nullable().comment("Updated at date");

      t.string("realname").nullable().comment("Real name");

      t.string("username", lengths.username.max).notNull().comment("User name");
      t.unique("username");
      t.index("username");

      t.string("email").notNull().comment("Email");
      t.unique("email");

      t.string("password").notNull().comment("Password");
      t.uuid("reset_code").nullable().comment("Reset password code");
      // Reset password code decay
      t.dateTime("reset_at").nullable().comment("Reset password at date");

      t.json("profile").comment("Users profile");

      t.enu("role", Object.values(roles)).defaultTo(roles.user).comment("Role");

      t.boolean("active").defaultTo(true).comment("Status");

      t.boolean("confirmed").defaultTo(false).comment("Confirmed");
      t.uuid("confirmation_code").nullable().comment("Activation code");
      // Confirmation code decay
      t.dateTime("confirmation_code_at").nullable().comment("Confirmation code at date");

      t.comment("Users");
    })
    .raw(`ALTER SEQUENCE ${tables.users}_id_seq RESTART WITH 1024`);

exports.down = (knex) => knex.schema.dropTable(tables.users);
