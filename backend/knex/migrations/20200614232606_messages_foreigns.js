const { tables } = require("../../constants");

exports.up = (knex) =>
  knex.schema.table(tables.messages, (t) => {
    t.integer("dialog_id").unsigned().notNullable();
    t.foreign("dialog_id").references("id").inTable(tables.dialogs).onDelete("CASCADE");

    t.integer("owner_id").unsigned().notNullable();
    t.foreign("owner_id").references("id").inTable(tables.users).onDelete("CASCADE");
  });

exports.down = (knex) =>
  knex.schema.table(tables.messages, (t) => {
    t.dropColumn("dialog_id");
    t.dropColumn("owner_id");
  });
