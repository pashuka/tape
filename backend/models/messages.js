const validator = require("validator");
const knex = require("../libraries/knex");
const { tables } = require("../constants");
const Repository = require("./repository");
const { BadRequest, NotFound } = require("../libraries/error");
const allowed = {
  schema: ["id", "message_id", "dialog_id", "created_at", "owner", "body"],
  conditions: ["message_id", "dialog_id"],
  select: ["message_id", "dialog_id", "created_at", "owner", "body"],
  insert: ["dialog_id", "owner", "body"],
  update: ["owner", "body"],
};

class model extends Repository {
  async findMany(conditions) {
    if (!this.user) {
      return;
    }
    if (!"dialog_id" in conditions) {
      return;
    }
    const { dialog_id } = conditions;
    if (!validator.isUUID(dialog_id)) {
      throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
    }
    const dialog = await knex(tables.dialogs)
      .select("dialog_id")
      .whereRaw("(participants)::jsonb \\? ?", [this.user.username])
      .where({ dialog_id })
      .first();
    if (!dialog) {
      return;
    }
    const records = await knex(this.table)
      .select(allowed.select)
      .where({ dialog_id: dialog.dialog_id })
      .orderBy("created_at")
      .offset(0)
      .limit(100);
    return records;
  }

  findOne(conditions) {
    return;
  }

  async insert(values) {
    const { dialog_id, username, message } = values;
    let dialog;
    // TODO: check on message length.
    if (typeof message !== "string") {
      throw new BadRequest([{ message: "Bad message" }]);
    }
    if (message.length > 2 * 1024) {
      throw new BadRequest([{ message: "Too long message" }]);
    }
    if (username && !dialog_id) {
      const participant = await knex(tables.users).select(["username"]).where({ username }).first();
      if (!participant) {
        return;
      }
      // TODO: check on duplicate end to end dialogs if we only have username and dialog_id is undefined
      dialog = await knex(tables.dialogs)
        .select("dialog_id")
        .whereRaw("jsonb_array_length(participants) = 2")
        .whereRaw("(participants)::jsonb \\? ?", [this.user.username])
        .whereRaw("(participants)::jsonb \\? ?", [participant.username])
        .first();
      if (dialog) {
        // throw because we try to create new dialog with new user, but dialog is exists
        // it means that we need to send dialog_id instead just username
        throw new BadRequest([{ username: "Bad username" }]);
      }

      dialog = await knex(tables.dialogs)
        .insert({
          owners: JSON.stringify([this.user.username, participant.username]),
          participants: JSON.stringify([this.user.username, participant.username]),
        })
        .returning(["dialog_id", "participants"]);
      dialog = dialog[0];
    } else if (dialog_id) {
      if (!validator.isUUID(dialog_id)) {
        throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
      }
      dialog = await knex(tables.dialogs)
        .select(["dialog_id", "participants"])
        .where({ dialog_id })
        .first();
    } else {
      return;
    }
    if (!dialog) {
      return;
    }
    if (!dialog.participants.includes(this.user.username)) {
      return;
    }
    return super.insert({ dialog_id: dialog.dialog_id, body: message, owner: this.user.username });
  }

  update(conditions, values) {
    return;
  }
}

module.exports = new model({
  table: tables.messages,
  allowed,
});
