const { tables, lengths } = require("../../constants");

exports.up = (knex) =>
  knex.schema
    .createTable(tables.messages, (t) => {
      t.comment("Messages");
      t.increments("id").unsigned().primary();
      t.uuid("message_id").defaultTo(
        knex.raw("md5(random()::text || clock_timestamp()::text)::uuid")
      );
      t.index("message_id");

      // t.integer("dialog").unsigned().notNullable();
      // t.foreign("dialog").references("id").inTable(tables.dialogs);
      t.uuid("dialog_id").notNullable();
      t.index("dialog_id");

      t.dateTime("created_at").notNull().defaultTo(knex.fn.now(6));

      // User's chat owner
      t.string("owner", lengths.username.max).notNull();
      t.index("owner");

      t.text("body").notNull();
    })
    .raw(`ALTER SEQUENCE ${tables.messages}_id_seq RESTART WITH 1024`);

exports.down = (knex) => knex.schema.dropTable(tables.messages);
