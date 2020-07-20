const knex = require("../libraries/knex");
const {
  tables: { dialogs: table },
} = require("../constants");
const Repository = require("./repository");
const allowed = {
  schema: [
    "dialog_id",
    "created_at",
    "participants",
    "last_message_owner",
    "last_message_body",
    "last_message_created_at",
    "profile",
  ],
  conditions: ["created_at", "owners", "participants"],
  select: [
    "dialog_id",
    "created_at",
    "participants",
    "last_message_owner",
    "last_message_body",
    "last_message_created_at",
    "profile",
  ],
  insert: ["owners", "participants", "profile"],
  update: ["owners", "participants", "profile"],
};

class model extends Repository {
  findMany(conditions) {
    if (!this.user) {
      return;
    }
    // select d.* from dialogs as d where (d.participants)::jsonb ? 'pav' ;
    return knex(this.table)
      .select(allowed.select)
      .whereRaw(`(${this.table}.participants)::jsonb \\? ?`, [this.user.username])
      .orderBy("last_message_created_at", "desc")
      .offset(0)
      .limit(100);
  }

  findOne(conditions) {
    return;
  }

  insert(values) {
    return;
  }

  update(conditions, values) {
    return;
  }
}

module.exports = new model({
  table,
  allowed,
});
