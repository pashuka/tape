const validator = require("validator");
const { BadRequest } = require("../libraries/error");
const knex = require("../libraries/knex");
const { tables, tapeEvents, lengths } = require("../constants");
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
    "member_count",
  ],
  conditions: ["created_at"],
  select: [
    "id",
    "created_at",
    "dialog_type",
    "last_message_body",
    "last_message_created_at",
    "profile",
    "member_count",
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
      .select({ id: `${this.table}.id` })
      .leftJoin(this.table, `${this.table}.id`, `${tables.members}.dialog_id`)
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

  async insert(values) {
    // TODO: remove picture on any fail

    const { picture, ["members[]"]: members, title } = values;
    const profile = {};
    // check title
    if (typeof title !== "string" || title.length === 0) {
      throw new BadRequest([{ title: "Bad" }]);
    }
    profile.title = title.substr(0, 128);

    // check members
    if (!Array.isArray(members)) {
      throw new BadRequest([{ members: "Bad type" }]);
    }
    if (members.length === 0) {
      throw new BadRequest([{ members: "Should not be empty" }]);
    }
    if (
      members.find(
        (_) =>
          typeof _ !== "string" ||
          _.length < lengths.username.min ||
          _.length > lengths.username.max
      )
    ) {
      throw new BadRequest([{ members: "Bad elements" }]);
    }
    const records = await knex(tables.users).select(["id"]).whereIn("username", members);
    if (!records || records.length !== members.length) {
      throw new BadRequest([{ members: "Elements not exist" }]);
    }

    // use picture
    if (picture) {
      profile.picture = picture;
    }

    // create group dialog
    const dialog = await knex(this.table)
      .insert({ dialog_type: "group", profile, member_count: records.length + 1 })
      .returning(this.allowed.select);
    if (!dialog) {
      throw new BadRequest([{ dialog: "Bad dialog" }]);
    }

    const dialog_id = dialog[0].id;
    const iam = { dialog_id, user_id: this.user.id };

    let membersWithDialog = [{ ...iam, dialog_type: "group", role: "admin" }];
    records.forEach(({ id }) =>
      membersWithDialog.push({ dialog_type: "group", dialog_id, user_id: id })
    );

    // push admins/members
    // TODO: remove after migration in production
    // await knex(tables.admins).insert(iam);
    await knex(tables.members).insert(membersWithDialog);

    // send events
    publisher.publish(
      tapeEvents.dialog_member_created,
      JSON.stringify({
        dialog: dialog[0],
        members: membersWithDialog.map(({ user_id }) => user_id),
      })
    );

    return dialog;
  }

  async update(conditions, values) {
    if (!this.user) {
      return;
    }

    // check dialog id
    const { dialog_id } = conditions;
    if (!validator.isNumeric(dialog_id)) {
      throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
    }

    const memberConditions = { dialog_id, user_id: this.user.id };
    // check user as dialog member
    const isMember = await knex(tables.members)
      .select(["unread_count", "unread_cursor", "settings"])
      .where(memberConditions)
      .first();
    if (!isMember) {
      return;
    }

    const { read_message_id, mute } = values;
    if (read_message_id) {
      if (isMember.unread_count < 0) {
        return;
      }

      // check message by id
      if (!validator.isNumeric(String(read_message_id))) {
        throw new BadRequest([{ read_message_id: "Bad read message id" }]);
      }
      const isMessage = await knex(tables.messages)
        .select("id")
        .where({ dialog_id, id: read_message_id })
        .first();
      if (!isMessage) {
        return;
      }

      if (isMember.unread_cursor === null || isMember.unread_cursor < isMessage.id) {
        // move cursor and reset unread_count
        const result = await knex(tables.members)
          .where(memberConditions)
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
    } else if (typeof mute === "boolean") {
      const settings = { ...isMember.settings, mute: !!mute };
      const result = await knex(tables.members)
        .where(memberConditions)
        .update({
          settings,
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
