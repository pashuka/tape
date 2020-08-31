const router = require("koa-router")();
const Auth = require("../../middlewares/auth");
const { tryParseJSON } = require("../../libraries/utils");
const { checkPerms } = require("../../libraries/accesscontrol");
const { has, upload } = require("../../libraries/formidable");
const { api, resources, supportMimes } = require("../../constants");
const { BadRequest } = require("../../libraries/error");
const { model } = require("../../libraries/utils");

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

  if (resources.dialogs === resource) {
    if (has(ctx.request.files)) {
      const file = ctx.request.files["file"];
      if (!supportMimes.includes(file.type)) {
        throw new BadRequest([{ mimeType: "bad" }]);
      }
      const picture = await upload(file, resource);
      body = { ...body, picture };
    }
  }

  const Model = model(resource);
  Model.user = user;
  const entity = await Model.insert(body);
  if (!entity || !Array.isArray(entity) || entity.length === 0) {
    throw new BadRequest([{ id: "Invalid" }]);
  }
  ctx.body = entity[0];
});

module.exports = router;
