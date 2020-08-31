const validator = require("validator");
const { BadRequest } = require("../libraries/error");
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
    /**
     * explain (analyze)
     * select m2.*,users.username, users.realname, users.profile
     * from members as m1
     * left join members as m2 on m1.dialog_id = m2.dialog_id
     * left join users on users.id=m2.user_id
     * where m1.user_id = 1295 and not m2.user_id = 1295;
     */

    const qb = knex
      .select({ dialog_id: "m2.dialog_id" })
      .select(["username", "realname", "profile"].map((c) => `${tables.users}.${c}`));

    if (dialog_id) {
      if (!validator.isNumeric(dialog_id)) {
        throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
      }
      // Check on self present in dialog members
      const iam = await knex(this.table)
        .select(["user_id"])
        .where(`${this.table}.user_id`, this.user.id)
        .andWhere(`${this.table}.dialog_id`, dialog_id)
        .first();

      if (!iam) {
        throw new BadRequest([{ dialog_id: "Bad dialog id" }]);
      }

      // qb.where(`${this.table}.dialog_id`, dialog_id);
      qb.from(`${this.table} as m2`)
        .leftJoin(tables.users, `${tables.users}.id`, "m2.user_id")
        .whereRaw("?? = ?", ["m2.dialog_id", dialog_id])
        .andWhereRaw("?? != ?", ["m2.user_id", this.user.id]);
    } else {
      qb.from(`${this.table} as m1`)
        .leftJoin(`${this.table} as m2`, (builder) => {
          builder.on("m1.dialog_id", "m2.dialog_id").andOn("m2.dialog_type", knex.raw("'direct'"));
        })
        .leftJoin(tables.users, `${tables.users}.id`, "m2.user_id")
        .whereRaw("?? = ?", ["m1.user_id", this.user.id])
        .andWhereRaw("?? != ?", ["m2.user_id", this.user.id])
        .andWhere(`m1.dialog_type`, knex.raw("'direct'"))
        .orderBy(`${tables.users}.realname`, "asc");
    }
    return qb.offset(offset).limit(this.limit);
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
