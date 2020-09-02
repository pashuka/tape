const { tables } = require("../../constants");

exports.up = (knex) =>
  knex.schema
    .table(tables.dialogs, (t) => {
      t.integer("member_count").unsigned().defaultTo(0);
    })
    .then(() =>
      knex.raw(`
        update ${tables.dialogs}
        set member_count = m.dcount
        from (
          select ${tables.members}.dialog_id as did, count(${tables.members}.dialog_id) as dcount
          from ${tables.members}
          group by members.dialog_id
        ) as m
        where id = m.did
        ;
      `)
    );

exports.down = (knex) =>
  knex.schema.table(tables.dialogs, (t) => {
    t.dropColumn("member_count");
  });
