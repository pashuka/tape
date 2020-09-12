const { tables } = require("../../constants");

exports.up = (knex) =>
  knex.schema.table(tables.messages, (t) => {
    t.integer("reply_id").unsigned();
    t.foreign("reply_id").references("id").inTable(tables.messages);
  });

exports.down = (knex) =>
  knex.schema.table(tables.messages, (t) => {
    t.dropColumn("reply_id");
  });
