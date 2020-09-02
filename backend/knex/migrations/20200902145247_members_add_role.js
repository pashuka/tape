const { tables, memberRoles } = require("../../constants");

exports.up = (knex) =>
  knex.schema
    .table(tables.members, (t) => {
      t.enu("role", memberRoles).defaultTo("member");
      t.index("role");
    })
    .then(() =>
      knex.raw(`
        update  ${tables.members} as m
        set role = 'admin'
        from (
          select * from ${tables.admins}
        ) as a
        where m.user_id = a.user_id and m.dialog_id = a.dialog_id
        ;
      `)
    );

exports.down = (knex) =>
  knex.schema.table(tables.members, (t) => {
    t.dropColumn("role");
  });
