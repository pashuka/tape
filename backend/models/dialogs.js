const validator = require("validator");
const knex = require("../libraries/knex");
const { tables } = require("../constants");
const Repository = require("./repository");
const allowed = {
  schema: [
    "id",
    "created_at",
    "dialog_type",
    "last_message_owner_id",
    "last_message_body",
    "last_message_created_at",
    "profile",
  ],
  conditions: ["created_at"],
  select: [
    "id",
    "created_at",
    "dialog_type",
    "last_message_body",
    "last_message_created_at",
    "profile",
  ],
  insert: ["profile"],
  update: ["profile"],
};

class model extends Repository {
  findMany(conditions) {
    if (!this.user) {
      return;
    }
    const { offset } = conditions;
    if (!validator.isNumeric(offset) || offset < 0 || offset > Number.MAX_VALUE) {
      throw new BadRequest([{ offset: "Bad offset" }]);
    }
    return knex(this.table)
      .select(allowed.select.map((c) => `${this.table}.${c}`))
      .select(["settings", "unread_count", "unread_cursor"].map((c) => `${tables.members}.${c}`))
      .select({ last_message_owner: `${tables.users}.username` })
      .leftJoin(tables.members, `${this.table}.id`, `${tables.members}.dialog_id`)
      .leftJoin(tables.users, `${this.table}.last_message_owner_id`, `${tables.users}.id`)
      .where(`${tables.members}.user_id`, this.user.id)
      .orderBy(`${this.table}.last_message_created_at`, "desc")
      .offset(offset)
      .limit(this.limit);
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
  table: tables.dialogs,
  allowed,
});
