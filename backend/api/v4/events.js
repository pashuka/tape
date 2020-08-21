const router = require("koa-router")();
const { checkPerms } = require("../../libraries/accesscontrol");
const streamTapeEvents = require("../../libraries/events");
const { api, roles, resources } = require("../../constants");

/**
 * @api {get} /v4/events
 * @apiVersion 4.0
 * @apiGroup Events
 * @apiName get
 * @apiSampleRequest /v4/events
 */
router.get(`/${api.v4}/${resources.events}`, async (ctx) => {
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
  checkPerms(resources.events, user.role, "readAny");

  // Find the implementation below
  streamTapeEvents(ctx.req, ctx.res);

  /**
   * To bypass Koa's built-in response handling, you may explicitly set ctx.respond = false;.
   * Use this if you want to write to the raw res object instead of letting Koa handle the
   * response for you.
   *
   * Note that using this is not supported by Koa. This may break intended functionality of
   * Koa middleware and Koa itself. Using this property is considered a hack and is only a
   * convenience to those wishing to use traditional fn(req, res) functions and middleware
   * within Koa.
   */
  ctx.respond = false;
});

module.exports = router;
