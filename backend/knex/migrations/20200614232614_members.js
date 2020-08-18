const { tables, dialogTypes } = require("../../constants");

exports.up = (knex) =>
  knex.schema.createTable(tables.members, (t) => {
    t.comment("Dialog members");

    t.enu("dialog_type", dialogTypes).defaultTo("direct");

    t.integer("dialog_id").unsigned().notNullable();
    t.foreign("dialog_id").references("id").inTable(tables.dialogs).onDelete("CASCADE");

    t.integer("user_id").unsigned().notNullable();
    t.foreign("user_id").references("id").inTable(tables.users).onDelete("CASCADE");

    t.integer("unread_count").unsigned().defaultTo(0);

    t.integer("unread_cursor").unsigned().nullable();
    t.foreign("unread_cursor").references("id").inTable(tables.messages).onDelete("CASCADE");

    t.jsonb("settings")
      .defaultTo(knex.raw("'{}'::json"))
      .comment("Own dialog settings like notification policy");

    t.index("dialog_id");
    t.index("user_id");
    t.index(["user_id", "dialog_id"]);
    t.index(["dialog_id", "dialog_type", "user_id"]);
  });

exports.down = (knex) => knex.schema.dropTable(tables.members);
