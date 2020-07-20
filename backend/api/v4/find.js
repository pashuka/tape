const router = require("koa-router")();
// const Auth = require("../../middlewares/auth");
const { checkPerms } = require("../../libraries/accesscontrol");
const { api, roles } = require("../../constants");
const { model } = require("../../libraries/utils");
const { NotFound } = require("../../libraries/error");

/**
 * @api {get} /v4/find/:resource+/?query=params List
 * @apiVersion 4.0
 * @apiGroup Entities
 * @apiName List
 * @apiSampleRequest /v4/find/resource/name/?query=params
 */
router.get(`/${api.v4}/find/:resource+/`, async (ctx) => {
  const resource = ctx.params.resource;
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
  checkPerms(ctx.params.resource, user.role, "readAny");

  const Model = model(resource);
  Model.user = user;
  const entities = await Model.findMany(ctx.request.query);
  if (!entities) {
    throw new NotFound();
  }

  ctx.body = entities;
});

module.exports = router;
