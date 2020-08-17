const { tables } = require("../../constants");

exports.up = (knex) =>
  knex.schema.table(tables.members, (t) => {
    t.index("dialog_id");
    t.index("user_id");
    t.index(["user_id", "dialog_id"]);
  });

exports.down = (knex) =>
  knex.schema.table(tables.members, (t) => {
    t.dropIndex("dialog_id");
    t.dropIndex("user_id");
    t.dropIndex(["user_id", "dialog_id"]);
  });
