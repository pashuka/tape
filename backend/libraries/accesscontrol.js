const AccessControl = require("accesscontrol");
const { Unauthorized, NotFound } = require("./error");
const { resources, grants, roles } = require("../constants");
const ac = new AccessControl(grants);

module.exports.checkPerms = (resource, role = roles.anonymous, actionPossession = "readAny") => {
  if (typeof resource === "undefined") {
    throw new NotFound("Resource bad name");
  }
  if (!Object.values(resources).includes(resource)) {
    throw new NotFound("Resource not found");
  }
  const permission = ac.can(role)[actionPossession](resource, ["*"]);
  if (!permission.granted) {
    throw new Unauthorized("Forbidden for user");
  }
  return permission;
};

module.exports.default = ac;
