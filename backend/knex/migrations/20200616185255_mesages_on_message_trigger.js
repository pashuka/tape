const { tables } = require("../../constants");
const functionName = "on_message";

exports.up = (knex) =>
  knex.raw(`
    create or replace function ${functionName}() returns trigger as $${functionName}$
      begin
        -- raise notice '%', new.body;
        update dialogs
          set
            last_message_id = new.id,
            last_message_owner_id = new.owner_id,
            last_message_body = new.body,
            last_message_created_at = new.created_at
          where id = new.dialog_id
        ;
        return null;
      end; $${functionName}$
      language 'plpgsql'
    ;

    drop trigger if exists ${functionName} on ${tables.messages};
    create trigger ${functionName}
      after insert or update on ${tables.messages}
      for each row execute procedure ${functionName}()
    ;
`);

exports.down = (knex) =>
  knex.raw(`
  drop trigger if exists ${functionName} on ${tables.messages};

  drop function if exists ${functionName}();
`);
