const knex = require("../libraries/knex");
const formatQuery = require("../libraries/query");
const { isEmpty, isGreaterZero } = require("../libraries/utils");

/**
 * Base repository class
 * @see {@link https://docs/backend/index.md}
 */
module.exports = class Repository {
  /**
   * Constructor
   * @param {object} user - current user
   * @param {string} table - db table name
   * @param {string} perms - access rights
   * @param {object} allowed - allowed processing columns
   */
  constructor({
    // user = { username: "system@user" },
    limit = 25,
    table,
    allowed = {
      schema: [],
      conditions: [],
      select: [],
      insert: [],
      update: [],
    },
    perms = {
      count: "readAny",
      findMany: "readAny",
      findOne: "readAny",
      insert: "createOwn",
      update: "updateOwn",
      increment: "updateOwn",
    },
  }) {
    this.limit = limit;
    this.table = table;
    this.allowed = allowed;
    this.perms = perms;
  }

  get User() {
    return this.user;
  }
  set User(user) {
    this.user = user;
  }

  /**
   * Check user permission to handle methods
   */
  isGranted(method) {
    // console.log(this.constructor.name, method);
    // checkPerms(this.constructor.name, this.user.role, this.perms[method]);
  }

  /**
   * Table schema
   */
  schema() {
    return knex(this.table).columnInfo();
  }

  /**
   * Filter object before send to knex
   */
  filterBeforeSendToKnex(o, predicate) {
    return Object.keys(o)
      .filter((key) => predicate(key))
      .reduce((res, key) => ((res[key] = this.cook(key, o[key])), res), {});
  }

  /**
   * Transform value before push
   * @param {string} key -
   */
  cook(key, value) {
    return value;
  }

  /**
   * Count records
   * @param {object} query - query object
   */
  count(query = {}) {
    const qb = knex(this.table).count();

    if (!isEmpty(query)) {
      const [q, bindings] = formatQuery(query, this.allowed.select);
      qb.whereRaw(q, bindings).first();
    }

    return qb.first();
  }

  /**
   * Find many items
   * @param {object} query - query object conditions
   * @param {string} sort - sort column name
   * @param {string} order - order by clause
   * @param {number} offset - offset pointer
   * @param {number} limit - count records
   * @param {string[]} columns - allowed columns
   */
  findMany(conditions, options = {}, allowed = this.allowed) {
    this.isGranted(this.findMany.name);
    conditions = this.filterBeforeSendToKnex(conditions, (_) => allowed.conditions.includes(_));
    allowed = Object.assign({}, this.allowed, allowed);
    const { sort, order, offset = 0, limit = 10 } = options;

    // The heart of the library, the knex query builder is the interface used for building and executing standard SQL queries, such as select, insert, update, delete.
    const qb = knex(this.table).select(allowed.select).where(conditions);

    // adds an order by clause to the query. column can be string,
    // TODO: or list mixed with string and object.
    if (sort && allowed.schema.includes(sort)) {
      qb.orderBy(sort, ["asc", "desc"].includes(order) ? order : "asc");
    }

    // adds an offset clause to the query
    if (isGreaterZero(typeof offset === "string" ? parseInt(offset, 10) : offset)) {
      qb.offset(offset);
    }

    // adds a limit clause to the query
    if (isGreaterZero(typeof limit === "string" ? parseInt(limit, 10) : limit)) {
      qb.limit(limit);
    }

    return qb;
  }

  /**
   * Get single record
   * @param {object} conditions - query object conditions
   */
  findOne(conditions, allowed = this.allowed) {
    this.isGranted(this.findOne.name);
    allowed = Object.assign({}, this.allowed, allowed);
    conditions = this.filterBeforeSendToKnex(conditions, (_) => allowed.conditions.includes(_));
    // if (isEmpty(conditions)) {
    //   return [];
    // }
    return knex(this.table).select(allowed.select).where(conditions).first();
  }

  /**
   * New record
   * @param {object} values - data to insert
   */
  insert(values, allowed = this.allowed) {
    allowed = Object.assign({}, this.allowed, allowed);
    return knex(this.table)
      .insert(this.filterBeforeSendToKnex(values, (_) => allowed.insert.includes(_)))
      .returning(allowed.select);
  }

  /**
   * Update record
   * @param {number} conditions - query object conditions
   * @param {object} values - data to update
   */
  update(conditions, values = {}, allowed = this.allowed) {
    allowed = Object.assign({}, this.allowed, allowed);
    return knex(this.table)
      .where(conditions)
      .update(this.filterBeforeSendToKnex(values, (_) => allowed.update.includes(_)))
      .returning(allowed.select);
  }

  /**
   * Increment column
   * @param {number} conditions - query object conditions
   * @param {object} values - data to update
   */
  increment(conditions, column = "counter", amount = 1, allowed = this.allowed) {
    allowed = Object.assign({}, this.allowed, allowed);
    return knex(this.table).where(conditions).increment(column, amount).returning(allowed.select);
  }
};
