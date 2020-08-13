const { tables, lengths } = require("../../constants");

exports.up = (knex) =>
  knex.schema
    .createTable(tables.messages, (t) => {
      t.comment("Messages");

      t.increments("id").unsigned().primary();
      t.dateTime("created_at").notNull().defaultTo(knex.fn.now(6)).comment("Created at date");
      t.dateTime("updated_at").nullable().comment("Updated at date");

      t.text("body").notNull();
    })
    .raw(`ALTER SEQUENCE ${tables.messages}_id_seq RESTART WITH 1024`);

exports.down = (knex) => knex.schema.dropTable(tables.messages);
