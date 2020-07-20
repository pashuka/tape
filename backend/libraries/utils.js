const tryParseJSON = (jsonString) => {
  try {
    var o = JSON.parse(jsonString);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}

  return false;
};

const getSelect = (table, fields, prefix = "", [wrapL, wrapR] = ["", ""]) =>
  fields.map((f) => `${wrapL}${table}.${f}${wrapR} as ${prefix}${f}`);

const getWhere = (table, where) =>
  Object.keys(where).map((f) => ({
    [`${table}.${f}`]: where[f],
  }));

const isEmpty = (o) => Object.entries(o).length === 0 && o.constructor === Object;

const pgToISO8601 = (val) => {
  if (val === null) {
    return null;
  }

  // supports following formats:
  //
  // 2014-09-23 15:29:18.37788+03
  // 2014-09-23 15:29:18-03
  // 2014-09-23 15:29:18.38+03:30
  // 2014-09-23 15:29:18+00
  // 2014-09-23 15:29:18.38
  // 2014-09-23 15:29:18

  val = val.replace(" ", "T");
  const positiveTimezoneOffset = val.lastIndexOf("+");
  const negativeTimezoneOffset = val.lastIndexOf("-");
  const subSecondOffset = val.lastIndexOf(".");
  let firstPartLength = val.length;

  let timezone = "";
  if (positiveTimezoneOffset > 18 || negativeTimezoneOffset > 18) {
    const offset = Math.max(positiveTimezoneOffset, negativeTimezoneOffset);
    const sign = positiveTimezoneOffset > -1 ? "+" : "-";
    const normalizedTz = val.substr(offset + 1).replace(":", "");
    const hours = normalizedTz.substr(0, 2);
    const minutes = normalizedTz.substr(2, 2);
    timezone = sign + hours + ":" + (minutes || "00");
    firstPartLength = offset;
  }

  let milliseconds = ""; //".000";
  if (subSecondOffset != -1) {
    // parseFloat ignores offset part of string
    milliseconds = parseFloat(val.substr(subSecondOffset)).toFixed(3).substr(1);
    firstPartLength = subSecondOffset;
  }

  const dateHoursMinutesSeconds = val.substr(0, firstPartLength);

  return dateHoursMinutesSeconds + milliseconds + timezone;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const model = (resource) => require(`../models/${resource}`);

const randomString = (length = 16) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const mogranPredefinedFormats = {
  development: "dev",
  production: "combined",
};

const isGreaterZero = (n) => typeof n === "number" && !Number.isNaN(n) && n >= 0;

module.exports = {
  tryParseJSON,
  getSelect,
  getWhere,
  isEmpty,
  isGreaterZero,
  pgToISO8601,
  delay,
  model,
  randomString,
  mogranPredefinedFormats,
};
