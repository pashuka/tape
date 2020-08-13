const validator = require("validator");
const knex = require("../libraries/knex");
const { tables } = require("../constants");
const Repository = require("./repository");
const allowed = {
  schema: ["dialog_id", "user_id"],
  conditions: ["dialog_id", "user_id"],
  select: ["dialog_id", "user_id"],
  insert: [],
  update: [],
};

class model extends Repository {
  async findMany(conditions) {
    if (!this.user) {
      return;
    }
    const { dialog_id, offset } = conditions;
    if (!validator.isNumeric(offset) || offset < 0 || offset > Number.MAX_VALUE) {
      throw new BadRequest([{ offset: "Bad offset" }]);
    }
    const qb = knex(this.table)
      .select(`${this.table}.dialog_id`)
      .select(["username", "realname", "profile"].map((c) => `${tables.users}.${c}`))
      .leftJoin(tables.users, `${tables.users}.id`, `${this.table}.user_id`)
      .whereNot(`${this.table}.user_id`, this.user.id)
      .offset(offset)
      .limit(this.limit);

    if (dialog_id) {
      if (!validator.isNumeric(dialog_id)) {
        throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
      }
      // Check on self present in dialog members
      const iam = await knex(this.table)
        .select(["user_id"])
        .where(`${this.table}.user_id`, this.user.id)
        .where(`${this.table}.dialog_id`, dialog_id)
        .first();

      if (!iam) {
        throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
      }

      qb.where(`${this.table}.dialog_id`, dialog_id);
    } else {
      qb.orderBy(`${tables.users}.realname`, "asc");
    }

    return qb;
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
  table: tables.members,
  allowed,
});
