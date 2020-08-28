const validator = require("validator");
const { BadRequest } = require("../libraries/error");
const knex = require("../libraries/knex");
const { tables, tapeEvents } = require("../constants");
const Repository = require("./repository");
const { publisher } = require("../libraries/ioredis");
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
    return knex(tables.members)
      .select({ id: `${tables.dialogs}.id` })
      .leftJoin(tables.dialogs, `${this.table}.id`, `${tables.members}.dialog_id`)
      .where(`${tables.members}.user_id`, this.user.id)
      .orderBy(`${this.table}.last_message_created_at`, "desc")
      .offset(offset)
      .limit(this.limit);
  }

  findOne(conditions) {
    if (!this.user) {
      return;
    }
    const { id } = conditions;
    if (!id || !validator.isNumeric(id)) {
      throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
    }
    return knex(this.table)
      .select(allowed.select.map((c) => `${this.table}.${c}`))
      .select(["settings", "unread_count", "unread_cursor"].map((c) => `${tables.members}.${c}`))
      .select({ last_message_owner: `${tables.users}.username` })
      .leftJoin(tables.members, `${this.table}.id`, `${tables.members}.dialog_id`)
      .leftJoin(tables.users, `${this.table}.last_message_owner_id`, `${tables.users}.id`)
      .where(`${this.table}.id`, id)
      .andWhere(`${tables.members}.user_id`, this.user.id)
      .first();
  }

  insert(values) {
    return;
  }

  async update(conditions, values) {
    if (!this.user) {
      return;
    }
    const { dialog_id } = conditions;
    const { read_message_id } = values;
    if (!validator.isNumeric(dialog_id)) {
      throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
    }
    if (!validator.isNumeric(String(read_message_id))) {
      throw new BadRequest([{ read_message_id: "Bad read message id" }]);
    }
    const isMember = await knex(tables.members)
      .select(["unread_count", "unread_cursor"])
      .where({ dialog_id, user_id: this.user.id })
      .first();
    if (!isMember) {
      return;
    }
    const isMessage = await knex(tables.messages)
      .select("id")
      .where({ dialog_id, id: read_message_id })
      .first();
    if (!isMessage) {
      return;
    }
    if (isMember.unread_cursor < isMessage.id) {
      // move cursor and reset unread_count
      const result = await knex(tables.members)
        .where({ dialog_id, user_id: this.user.id })
        .update({
          unread_cursor: read_message_id,
          unread_count: 0,
        })
        .returning(["dialog_id", "user_id", "unread_count", "unread_cursor"]);
      if (!result) {
        return;
      }
      // push notification && send event
      publisher.publish(tapeEvents.dialog_changed, JSON.stringify(result[0]));
      return result;
    }

    return;
  }
}

module.exports = new model({
  table: tables.dialogs,
  allowed,
});
