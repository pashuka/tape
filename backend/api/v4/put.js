const router = require("koa-router")();
const Auth = require("../../middlewares/auth");
const { tryParseJSON } = require("../../libraries/utils");
const { checkPerms } = require("../../libraries/accesscontrol");
const { api, resources } = require("../../constants");
const { BadRequest } = require("../../libraries/error");
const { model } = require("../../libraries/utils");

/**
 * @api {put} /v4/put/:resource+/:id Update
 * @apiVersion 4.0
 * @apiGroup Entity
 * @apiName Update
 * @apiSampleRequest /v4/put/resource/name/1024
 */
router.put(`/${api.v4}/put/:resource+/`, Auth, async (ctx) => {
  const resource = ctx.params.resource;
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
  const perms = checkPerms(resource, user.role, "updateOwn");

  let entity,
    body = typeof ctx.request.body === "object" ? ctx.request.body : tryParseJSON(ctx.request.body);

  body = perms.filter(body);
  if (!body) {
    throw new BadRequest([{ body: "Empty body" }]);
  }
  if (Object.entries(body).length === 0 && body.constructor === Object) {
    throw new BadRequest([{ body: "body data does not contain any values to update" }]);
  } else {
    const Model = model(resource);
    Model.user = user;
    entity = await Model.update(ctx.request.query, body);
  }
  if (!entity || !Array.isArray(entity) || entity.length === 0) {
    throw new BadRequest([{ id: "invalid" }]);
  }

  if (resources.user === resource && entity[0].username !== user.username) {
    ctx.login(entity[0]);
  }

  ctx.body = entity[0];
});

module.exports = router;
