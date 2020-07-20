const router = require("koa-router")();
const { checkPerms } = require("../../libraries/accesscontrol");
const { api } = require("../../constants");
const { model } = require("../../libraries/utils");
const { NotFound } = require("../../libraries/error");

/**
 * @api {get} /v4/count/:resource+/?query=params List
 * @apiVersion 4.0
 * @apiGroup Entities
 * @apiName List
 * @apiSampleRequest /v4/count/resource/name/?query=params
 */
router.get(`/${api.v4}/count/:resource+/`, async (ctx) => {
  const resource = ctx.params.resource;
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
  checkPerms(ctx.params.resource, ctx.req.user.role, "readAny");

  const Model = model(resource);
  Model.user = user;
  const entities = await Model.count(ctx.request.query);
  if (!entities) {
    throw new NotFound();
  }

  ctx.body = entities;
});

module.exports = router;
