const bcrypt = require("bcryptjs");
const config = require("../../.env");
const {
  tables: { users: TABLE }
} = require("../../constants");

exports.seed = knex => {
  const list = config.seed[TABLE].map(_ => ({ ..._, password: bcrypt.hashSync(_.password, 10) }));
  return knex(TABLE)
    .del()
    .then(() => knex(TABLE).insert(list));
};
