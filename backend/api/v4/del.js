const router = require("koa-router")();
const Auth = require("../../middlewares/auth");
const { checkPerms } = require("../../libraries/accesscontrol");
const { api, resources } = require("../../constants");
const { BadRequest } = require("../../libraries/error");
const { model } = require("../../libraries/utils");

/**
 * @api {del} /v4/:resource+/:id Update
 * @apiVersion 4.0
 * @apiGroup Entity
 * @apiName Update
 * @apiSampleRequest /v4/resource/name/1024
 */
router.delete(`/${api.v4}/:resource+/`, Auth, async (ctx) => {
  const resource = ctx.params.resource;
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };

  checkPerms(resource, user.role, "deleteOwn");

  const Model = model(resource);
  Model.user = user;
  const entity = await Model.del(ctx.request.query);
  if (!Number.isInteger(entity)) {
    throw new BadRequest([{ id: "invalid" }]);
  }
  ctx.body = { count: entity };
});

module.exports = router;
