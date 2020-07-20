/**
 * Determines if this is a Rule or RuleGroup
 * @param {RuleType|RuleGroupType} ruleOrGroup
 * @returns {boolean}
 */
const isRuleGroup = ruleOrGroup => {
  return !!(ruleOrGroup.c && ruleOrGroup.r);
};

const allowedOperators = ["~*", "~", "null", "notNull", "=", "!=", "ok", "problem", ">", "<"];

const validateRule = (colsAllowed, { f, o, v }) => {
  if (Array.isArray(colsAllowed) && colsAllowed.indexOf(f) === -1) {
    return false;
  }
  if (allowedOperators.indexOf(o) === -1) {
    return false;
  }
  // TODO: validate & sanitize value
  return true;
};

/**
 * Formats a query in the requested output PostgeSQL format. By default, values
 * are processed assuming the default operators are being used.
 * @param {RuleGroup} ruleGroup
 */
module.exports = (ruleGroup, colsAllowed = [], table) => {
  table = table ? `${table}.` : "";
  const processRule = rule => {
    let operator = rule.o;
    let value = rule.v;
    let field = rule.f;

    // special rule
    if (["jmoderated", "applications.jmoderated"].includes(field)) {
      field = `${rule.f} -> '${value}' ->> '${operator}'`;
      if (rule.o.toLowerCase() === "ok") {
        operator = "=";
        value = true;
      } else {
        field = `${rule.f} -> '${value}' ->> 'ok'`;
        operator = "is null";
        value = undefined;
      }
    }
    // usual use
    else if (
      rule.o.toLowerCase() === "null" ||
      rule.v === null ||
      (typeof rule.v === "string" && rule.v.toLowerCase() === "null")
    ) {
      operator = "is null";
      value = undefined;
    } else if (
      rule.o.toLowerCase() === "notnull" ||
      (typeof rule.v === "string" && rule.v.toLowerCase() === "notnull")
    ) {
      operator = "is not null";
      value = undefined;
    } else if (rule.o.toLowerCase() === "notin") {
      operator = "not in";
      value = undefined;
    } else if (rule.o.toLowerCase() === "like") {
      operator = "like";
      value = undefined;
      // value = `%${value}%`
    } else if (rule.o.toLowerCase() === ">" || rule.o.toLowerCase() === "<") {
      value = `${value} 00:00:00`;
    }
    return [table + field, operator, value];
  };
  const processRuleGroup = ({ r = [], c = "AND" } = {}) => {
    const processedRules = r
      .filter(rule => validateRule(colsAllowed, rule))
      .map(rule => {
        if (isRuleGroup(rule)) {
          return processRuleGroup(rule);
        }
        return processRule(rule);
      });
    return processedRules.reduce(
      (accumulator, _) => {
        if (accumulator[0].length) {
          accumulator[0] += ` ${c} `;
        }
        const value = _.pop();
        accumulator[0] += _.join(" ");
        if (value !== undefined) {
          accumulator[1].push(value);
          accumulator[0] += " ? ";
        }
        return accumulator;
      },
      ["", []]
    );
  };
  return processRuleGroup(ruleGroup);
};
