const router = require("koa-router")();
const { checkPerms } = require("../../libraries/accesscontrol");
const { api, roles } = require("../../constants");
const { model } = require("../../libraries/utils");
const { NotFound } = require("../../libraries/error");

/**
 * @api {get} /v4/get/:resource+/?query=params Get
 * @apiVersion 4.0
 * @apiGroup Entity
 * @apiName Get
 * @apiSampleRequest /v4/get/resource/name/?query=params
 */
router.get(`/${api.v4}/get/:resource+/`, async (ctx) => {
  const resource = ctx.params.resource;
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
  checkPerms(resource, user.role, "readAny");

  const Model = model(resource);
  Model.user = user;
  const entity = await Model.findOne(ctx.request.query);
  if (!entity) {
    throw new NotFound();
  }

  ctx.body = entity;
});

module.exports = router;
