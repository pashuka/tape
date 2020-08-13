const { tables, lengths } = require("../../constants");

exports.up = (knex) =>
  knex.schema
    .createTable(tables.dialogs, (t) => {
      t.comment("Dialogs");

      t.increments("id").unsigned().primary();
      t.dateTime("created_at").notNull().defaultTo(knex.fn.now(6)).comment("Created at date");
      t.dateTime("updated_at").nullable().comment("Updated at date");

      t.jsonb("profile").defaultTo(knex.raw("'{}'::json")).comment("Dialog profile");

      t.text("last_message_body").defaultTo("");
      t.dateTime("last_message_created_at").defaultTo(knex.fn.now(6));
    })
    .raw(`ALTER SEQUENCE ${tables.dialogs}_id_seq RESTART WITH 1024`);

exports.down = (knex) => knex.schema.dropTable(tables.dialogs);
