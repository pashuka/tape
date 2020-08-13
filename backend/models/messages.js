const validator = require("validator");
const knex = require("../libraries/knex");
const { tables } = require("../constants");
const Repository = require("./repository");
const { BadRequest } = require("../libraries/error");
const allowed = {
  schema: ["id", "dialog_id", "created_at", "owner_id", "body"],
  conditions: ["dialog_id"],
  select: ["dialog_id", "created_at", "body"],
  insert: ["dialog_id", "owner", "body"],
  update: ["owner_id", "body"],
};

class model extends Repository {
  async findMany(conditions) {
    if (!this.user) {
      return;
    }
    if (!"dialog_id" in conditions) {
      throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
    }
    const { dialog_id } = conditions;
    if (!validator.isNumeric(dialog_id)) {
      throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
    }
    const dialog = await knex(tables.members)
      .select("dialog_id")
      .where({ dialog_id, user_id: this.user.id })
      .first();
    if (!dialog) {
      return;
    }
    const records = await knex(this.table)
      .select(allowed.select.map((c) => `${this.table}.${c}`))
      .select({ owner: `${tables.users}.username` })
      .leftJoin(tables.users, `${tables.users}.id`, `${this.table}.owner_id`)
      .where({ dialog_id: dialog.dialog_id })
      .orderBy(`${this.table}.created_at`)
      .offset(0)
      .limit(10);
    return records;
  }

  findOne(conditions) {
    return;
  }

  async insert(values) {
    const { dialog_id, username, message } = values;
    let dialog;
    if (typeof message !== "string") {
      throw new BadRequest([{ message: "Bad message" }]);
    }
    if (message.length > 2 * 1024) {
      throw new BadRequest([{ message: "Too long message" }]);
    }
    if (username && !dialog_id) {
      const participant = await knex(tables.users)
        .select(["id", "username"])
        .where({ username })
        .first();
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
      if (!validator.isNumeric(dialog_id)) {
        throw new BadRequest([{ dialog_id: "Bad dialog_id" }]);
      }
      dialog = await knex(tables.dialogs)
        .select(["dialog_id", "participants"])
        .where({ dialog_id })
        .first();

      dialog = await knex(tables.dialogs)
        .select(["id"])
        .leftJoin(tables.members, `${this.table}.id`, `${tables.members}.dialog_id`)
        .where(`${tables.members}.user_id`, this.user.id)
        .where(`${tables.members}.dialog_id`, this.user.id)
        .first();
    } else {
      throw new BadRequest([{ values: "Bad command" }]);
    }
    if (!dialog) {
      throw new BadRequest([{ dialog: "Bad dialog" }]);
    }

    // if (!dialog.participants.includes(this.user.username)) {
    //   return;
    // }
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
