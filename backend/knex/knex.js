const environment = process.env.ENVIRONMENT || "development";
const config = require("../.env").knex[environment];
module.exports = require("knex")(config);
