const { tables } = require("../../constants");

exports.up = (knex) =>
  knex.schema.alterTable(tables.messages, (t) => {
    t.text("body").nullable().alter();
  });

exports.down = (knex) =>
  knex.schema.alterTable(tables.messages, (t) => {
    t.text("body").notNull().alter();
  });
