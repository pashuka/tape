const fs = require("fs");
const router = require("koa-router")();

const config = require("../../.env").formidable;
const Auth = require("../../middlewares/auth");
const { model } = require("../../libraries/utils");
const { checkPerms } = require("../../libraries/accesscontrol");
const { has, upload } = require("../../libraries/formidable");
const { api, resources, supportMimes } = require("../../constants");
const { BadRequest } = require("../../libraries/error");

const removeFile = (resource, profile) => {
  if (!profile || !profile.picture) {
    return;
  }
  const pPath = `${process.cwd()}/${config.destination}/${resource}/${profile.picture}`;
  if (fs.existsSync(pPath)) {
    fs.unlinkSync(pPath);
  }
  const thumbPath = `${process.cwd()}/${config.destination}/${resource}/${config.thumb.prefix}${
    profile.picture
  }`;
  if (fs.existsSync(thumbPath)) {
    fs.unlinkSync(thumbPath);
  }
};

/**
 * @api {put} /v4/picture/:resource+/:id Upload file
 * @apiVersion 4.0
 * @apiGroup Entity
 * @apiName Update
 * @apiSampleRequest /v4/picture/resource/name/1024
 */
router.put(`/${api.v4}/picture/:resource+/`, Auth, async (ctx) => {
  const resource = ctx.params.resource;
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
  checkPerms(resource, user.role, "updateOwn");

  if (![resources.user].includes(resource)) {
    throw new BadRequest([{ resource: "bad" }]);
  }
  if (!has(ctx.request.files)) {
    throw new BabRequest([{ file: "empty" }]);
  }

  const Model = model(resource);
  Model.user = user;

  let query = ctx.request.query;
  let profile;

  if (resources.user === resource) {
    if (!query || !query.username || query.username !== user.username) {
      throw new BabRequest([{ update: "!own" }]);
    }
    query = { username: user.username };
    profile = user.profile;
  }

  const reqFile = ctx.request.files["file"];
  if (!supportMimes.includes(reqFile.type)) {
    throw new BadRequest([{ mimeType: "bad" }]);
  }
  const picture = await upload(reqFile, resource);

  entity = await Model.update(query, { profile: { ...profile, picture } });

  if (!entity || !Array.isArray(entity) || entity.length === 0) {
    throw new BadRequest([{ id: "invalid" }]);
  }

  // remove current avatar if uploaded and resized before
  removeFile(resource, profile);

  ctx.body = entity[0];
});

/**
 * @api {delete} /v4/picture/:resource+/:id Delete file
 * @apiVersion 4.0
 * @apiGroup Entity
 * @apiName Delete
 * @apiSampleRequest /v4/picture/resource/name/1024
 */
router.delete(`/${api.v4}/picture/:resource+/`, Auth, async (ctx) => {
  const resource = ctx.params.resource;
  const user = ctx.req.user || { id: 1, email: roles.anonymous, role: roles.anonymous };
  checkPerms(resource, user.role, "deleteOwn");

  if (![resources.user].includes(resource)) {
    throw new BadRequest([{ resource: "bad" }]);
  }

  const Model = model(resource);
  Model.user = user;

  let query = ctx.request.query;
  let profile;

  if (resources.user === resource) {
    if (!query || !query.username || query.username !== user.username) {
      throw new BabRequest([{ update: "!own" }]);
    }
    query = { username: user.username };
    profile = user.profile;
  }

  entity = await Model.update(query, { profile: { ...profile, picture: undefined } });

  if (!entity || !Array.isArray(entity) || entity.length === 0) {
    throw new BadRequest([{ id: "invalid" }]);
  }

  // remove current avatar if uploaded and resized before
  removeFile(resource, profile);

  ctx.body = entity[0];
});

module.exports = router;
