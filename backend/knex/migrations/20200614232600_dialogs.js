const { tables, lengths } = require("../../constants");

exports.up = (knex) =>
  knex.schema
    .createTable(tables.dialogs, (t) => {
      t.comment("Dialogs");

      t.increments("id").unsigned().primary();
      // t.uuid("dialog_id").defaultTo(knex.raw("uuid_generate_v4()"));
      t.uuid("dialog_id").defaultTo(
        knex.raw("md5(random()::text || clock_timestamp()::text)::uuid")
      );
      t.index("dialog_id");

      t.dateTime("created_at").notNull().defaultTo(knex.fn.now(6));

      // User's dialog owner
      t.jsonb("owners").defaultTo(knex.raw("'[]'::json"));

      // array of usernames, can be one by one or group messaging
      t.jsonb("participants").defaultTo(knex.raw("'[]'::json"));

      t.json("profile");

      // t.integer("last_message_id").unsigned().defaultTo(0);
      t.uuid("last_message_id").nullable();
      t.index("last_message_id");

      // t.foreign("last_message_id").references("id").inTable(tables.messages);
      t.string("last_message_owner", lengths.username.max).defaultTo("");
      t.text("last_message_body").defaultTo("");
      t.dateTime("last_message_created_at").defaultTo(knex.fn.now(6));
    })
    .raw(`ALTER SEQUENCE ${tables.dialogs}_id_seq RESTART WITH 1024`);

exports.down = (knex) => knex.schema.dropTable(tables.dialogs);
