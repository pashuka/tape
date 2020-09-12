const { tables } = require("../../constants");
const functionName = "on_message";

exports.up = (knex) =>
  knex.raw(`
    drop trigger if exists ${functionName} on ${tables.messages};
    create trigger ${functionName}
      after insert on ${tables.messages}
      for each row execute procedure ${functionName}()
    ;
  `);

exports.down = (knex) =>
  knex.raw(`
    drop trigger if exists ${functionName} on ${tables.messages};
    create trigger ${functionName}
      after insert or update on ${tables.messages}
      for each row execute procedure ${functionName}()
    ;
  `);
