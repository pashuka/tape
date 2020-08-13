const { tables } = require("../../constants");

exports.up = (knex) =>
  knex.schema.createTable(tables.admins, (t) => {
    t.comment("Dialog admins");

    t.integer("dialog_id").unsigned().notNullable();
    t.foreign("dialog_id").references("id").inTable(tables.dialogs).onDelete("CASCADE");

    t.integer("user_id").unsigned().notNullable();
    t.foreign("user_id").references("id").inTable(tables.users).onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable(tables.admins);
