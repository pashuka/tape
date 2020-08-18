const router = require("koa-router")();
const Auth = require("../../middlewares/auth");
const { tryParseJSON } = require("../../libraries/utils");
const { checkPerms } = require("../../libraries/accesscontrol");
const { api } = require("../../constants");
const { BadRequest } = require("../../libraries/error");
const { model } = require("../../libraries/utils");
// const events = require("events");
// const dispatcher = new events.EventEmitter();

/**
 * @api {post} /v4/post/:resource+/?query=params Create
 * @apiVersion 4.0
 * @apiGroup Entity
 * @apiName Create
 * @apiSampleRequest /v4/post/resource/name/?query=params
 */
router.post(`/${api.v4}/post/:resource+/`, Auth, async (ctx) => {
  const resource = ctx.params.resource;
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
  const perms = checkPerms(resource, user.role, "createOwn");

  let body =
    typeof ctx.request.body === "object" ? ctx.request.body : tryParseJSON(ctx.request.body);

  if (!body) {
    throw new BadRequest([{ body: "Invalid" }]);
  }

  body = perms.filter(body);
  if (Object.entries(body).length === 0 && body.constructor === Object) {
    throw new BadRequest([
      {
        status: "Update data does not contain any values to update",
      },
    ]);
  }

  const Model = model(resource);
  Model.user = user;
  const entity = await Model.insert(body);
  if (!entity || !Array.isArray(entity) || entity.length === 0) {
    throw new BadRequest([{ id: "Invalid" }]);
  }
  ctx.body = entity[0];
  // console.log('dispatcher.emit("message", ctx.body);');
  // dispatcher.emit("message", ctx.body);
  // ctx.sse.send("new message");
});

module.exports = router;
