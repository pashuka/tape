const { tables } = require("../../constants");

exports.up = (knex) =>
  knex.schema.table(tables.dialogs, (t) => {
    t.integer("last_message_id").unsigned();
    t.foreign("last_message_id").references("id").inTable(tables.messages);

    t.integer("last_message_owner_id").unsigned();
    t.foreign("last_message_owner_id").references("id").inTable(tables.users);
  });

exports.down = (knex) =>
  knex.schema.table(tables.dialogs, (t) => {
    t.dropColumn("last_message_id");
    t.dropColumn("last_message_owner_id");
  });
