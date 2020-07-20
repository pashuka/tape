// initialize pg date parsers before knex config initial
// https://github.com/knex/knex/issues/3071
const { types } = require("pg");
const { builtins } = require("pg-types");
const { pgToISO8601 } = require("./utils");
// Don't parse timestamps to js Date() objects, but just ISO8601 strings
types.setTypeParser(builtins.TIMESTAMPTZ, pgToISO8601);
types.setTypeParser(builtins.TIMESTAMPT, pgToISO8601);
types.setTypeParser(builtins.DATE, pgToISO8601);

const knex = require("knex");
const config = require("../.env").knex[process.env.NODE_ENV];

module.exports = knex(config);
