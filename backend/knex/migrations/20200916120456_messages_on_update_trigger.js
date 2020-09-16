const { tables } = require("../../constants");
const functionName = "on_message_update";

exports.up = (knex) =>
  knex.raw(`
    create or replace function ${functionName}() returns trigger as $${functionName}$
      begin
        -- On update message we can only set new body column, it's possible in two actions: edit or delete.
        -- On delete action body is null, on edit action body just changed
        -- Warning: we update dialog only if it last_message_id euqal message.id
        update dialogs
          set
            last_message_id = new.id,
            last_message_owner_id = new.owner_id,
            last_message_body = new.body,
            last_message_created_at = new.created_at
          where id = new.dialog_id and last_message_id = new.id
        ;
        return null;
      end; $${functionName}$
      language 'plpgsql'
    ;

    drop trigger if exists ${functionName} on ${tables.messages};
    create trigger ${functionName}
      after update on ${tables.messages}
      for each row execute procedure ${functionName}()
    ;
  `);

exports.down = (knex) =>
  knex.raw(`
    drop trigger if exists ${functionName} on ${tables.messages};
    drop function if exists ${functionName}();
  `);
