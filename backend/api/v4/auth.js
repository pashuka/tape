const router = require("koa-router")();
const passport = require("koa-passport");
const validator = require("validator");
const { model } = require("../../libraries/utils");

const { coreUser, api, resources, lengths } = require("../../constants");
const { BadRequest, Unauthorized, NotFound } = require("../../libraries/error");
const Auth = require("../../middlewares/auth");
const publicUserObject = ({ username, realname, profile }) => ({ username });

router
  /**
   * @api {post} /v4/auth/signin Sign through passport
   * @apiVersion 4.0
   * @apiGroup Auth
   * @apiName SignIn
   * @apiParam {String{1,255}} email user email
   * @apiParam {String{1,20}} password user password
   * @apiParamExample {json} Request-Example:
   * {
   *    "email": "john@doe.domain",
   *    "password": "qweqwe"
   * }
   * @apiSampleRequest /v4/auth/signin
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "realname": "John Doe",
   *    "email": "john@doe.domain",
   *    "role": "user"
   * }
   */
  .post(`/${api.v4}/${resources.auth.signin}`, async (ctx) => {
    ctx
      .checkBody("email")
      .notEmpty("Username or email field is required")
      .len(
        lengths.email.min,
        lengths.email.max,
        `Username or email length must be between ${lengths.email.min} and ${lengths.email.max} characters`
      );
    ctx
      .checkBody("password")
      .notEmpty("Password field is required")
      .len(
        lengths.password.min,
        lengths.password.max,
        `Password length must be between ${lengths.password.min} and ${lengths.password.max} characters`
      );

    if (ctx.errors) throw new BadRequest(ctx.errors);

    const body = ctx.request.body;
    if (body.email.indexOf("@") !== -1) {
      if (!validator.isEmail(body.email)) {
        throw new BadRequest([{ email: "Username or email is invalid", request_code: 0b0010 }]);
      }
      // normailize email before singing
      body.email = validator.normalizeEmail(body.email);
    } else {
      if (!validator.isAlphanumeric(body.email)) {
        throw new BadRequest([{ email: "Username or email is invalid", request_code: 0b0100 }]);
      }
    }

    if (ctx.req.user && ctx.req.user.role) {
      throw new BadRequest([{ id: "Sign out before" }]);
    }

    return passport.authenticate("local", (err, user, info, status) => {
      if (!user) {
        throw new Unauthorized("Invalid Credentials");
      }
      ctx.login(user);
      ctx.body = publicUserObject(user);
    })(ctx);
  })

  /**
   * @api {post} /v4/auth/signup Sign Up
   * @apiVersion 4.0
   * @apiGroup Auth
   * @apiName SignUp
   * @apiParam {String{1,255}} name user name
   * @apiParam {String{1,255}} email user email
   * @apiParam {String{1,20}} password user password
   * @apiParamExample {json} Request-Example:
   * {
   *    "name": "John Doe",
   *    "email": "john@doe.domain",
   *    "password": "strong password"
   * }
   * @apiSampleRequest /v4/auth/signup
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "name": "John Doe",
   *    "email": "john@doe.domain",
   *    "role": "student"
   * }
   */
  .post(`/${api.v4}/${resources.auth.signup}`, async (ctx) => {
    ctx
      .checkBody("username")
      .notEmpty("Username field is required")
      .len(
        lengths.username.min,
        lengths.username.max,
        `Username length must be between ${lengths.username.min} and ${lengths.username.max} characters`
      )
      .isAlphanumeric(
        // "Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen."
        "Username may only contain alphanumeric characters"
      );

    ctx
      .checkBody("email")
      .notEmpty("Email field is required")
      .isEmail("Email is invalid or already taken");

    ctx
      .checkBody("password")
      .notEmpty("Password field is required")
      .len(
        lengths.password.min,
        lengths.password.max,
        `Password length must be between ${lengths.password.min} and ${lengths.password.max} characters`
      );

    if (ctx.errors) throw new BadRequest(ctx.errors);

    if (ctx.req.user && ctx.req.user.role) {
      throw new BadRequest([{ id: "Sign out before" }]);
    }

    const Model = model(resources.user);
    Model.user = coreUser;
    const entity = await Model.signup(ctx.request.body);
    ctx.login(entity);
    ctx.body = publicUserObject(entity);
  })

  /**
   * @api {get} /v4/auth/signout Sign Out
   * @apiVersion 4.0
   * @apiGroup Auth
   * @apiName SignOut
   * @apiSampleRequest /v4/auth/signout
   */
  .get(`/${api.v4}/${resources.auth.signout}`, async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.logout();
      ctx.body = { status: "ok" };
    } else {
      throw new Unauthorized("Invalid Session Credentials");
    }
  })

  /**
   * @api {get} /v4/auth/status Status
   * @apiVersion 4.0
   * @apiGroup Auth
   * @apiName Status
   * @apiSampleRequest /v4/auth/status
   */
  .get(`/${api.v4}/${resources.auth.status}`, Auth, async (ctx) => {
    const user = ctx.req.user;
    if (!user) {
      throw new Unauthorized("Invalid Session Object");
    }
    ctx.body = publicUserObject(user);
  })

  /**
   * @api {post} /v4/auth/reset Reset password
   * @apiVersion 4.0
   * @apiGroup Auth
   * @apiName Reset Password
   * @apiSampleRequest /v4/auth/reset
   */
  .post(`/${api.v4}/${resources.auth.reset}`, async (ctx) => {
    ctx
      .checkBody("email")
      .notEmpty("Username or email field is required")
      .len(
        lengths.email.min,
        lengths.email.max,
        `Username or email length must be between ${lengths.email.min} and ${lengths.email.max} characters`
      );

    if (ctx.errors) throw new BadRequest(ctx.errors);

    const body = ctx.request.body;
    if (body.email.indexOf("@") !== -1) {
      if (!validator.isEmail(body.email)) {
        throw new BadRequest([{ email: "Username or email is invalid", request_code: 0b0010 }]);
      }
      // normailize email before singing
      body.email = validator.normalizeEmail(body.email);
    } else {
      if (!validator.isAlphanumeric(body.email)) {
        throw new BadRequest([{ email: "Username or email is invalid", request_code: 0b0100 }]);
      }
    }

    if (ctx.req.user && ctx.req.user.role) {
      throw new BadRequest([{ id: "Sign out before" }]);
    }

    const Model = model(resources.user);
    Model.user = coreUser;
    const entity = await Model.forgot({
      [body.email.indexOf("@") !== -1 ? "email" : "username"]: body.email,
    });
    if (!entity) {
      // do not thrown because of security policy
      // throw new NotFound([{ user: "not found" }]);
    }
    ctx.body = ctx.request.body;
  })

  /**
   * @apiDescription steps
   * 1. check code is required and is UUID
   * 2. passwords same and contains lengths limits
   * 3. update use code as condition
   * @api {put} /v4/auth/reset?query=params Put new password
   * @apiVersion 4.0
   * @apiGroup Auth
   * @apiName Put new password
   * @apiSampleRequest /v4/auth/reset/?code=6b1178b5-c687-4ac1-aeea-7a2a40b147b7
   */
  .put(`/${api.v4}/${resources.auth.reset}`, async (ctx) => {
    if (ctx.req.user && ctx.req.user.role) {
      throw new BadRequest([{ id: "Sign out before" }]);
    }

    const { code: reset_code } = ctx.request.query;

    if (!reset_code) {
      throw new BadRequest([{ reset_code: "Reset code is required" }]);
    }

    if (!validator.isUUID(reset_code)) {
      throw new BadRequest([{ reset_code: "Reset code is invalid" }]);
    }

    ctx
      .checkBody("password1")
      .notEmpty("New password field is required")
      .len(
        lengths.password.min,
        lengths.password.max,
        `New password length must be between ${lengths.password.min} and ${lengths.password.max} characters`
      );

    ctx
      .checkBody("password2")
      .notEmpty("Confirm password field is required")
      .len(
        lengths.password.min,
        lengths.password.max,
        `Confirm password length must be between ${lengths.password.min} and ${lengths.password.max} characters`
      );

    if (ctx.errors) throw new BadRequest(ctx.errors);

    const { password1, password2 } = ctx.request.body;

    const Model = model(resources.user);
    Model.user = coreUser;
    const entity = await Model.reset(
      {
        reset_code,
      },
      {
        password1,
        password2,
      }
    );
    if (!entity[0]) {
      throw new NotFound("Code not found");
    }
    ctx.body = entity[0];
  })

  /**
   * @apiDescription steps
   * 1. check code is required and is UUID is in DB
   * 2. reset code if ok
   * 3. return user
   * @api {get} /v4/auth/verify?query=params Verify confirmation code
   * @apiVersion 4.0
   * @apiGroup Auth
   * @apiName Verify confirmation code
   * @apiSampleRequest /v4/auth/verify/?code=6b1178b5-c687-4ac1-aeea-7a2a40b147b7
   */
  .get(`/${api.v4}/${resources.auth.verify}`, async (ctx) => {
    const { code: confirmation_code } = ctx.request.query;
    if (!confirmation_code) {
      throw new BadRequest([{ confirmation_code: "Confirmation code is required" }]);
    }

    if (!validator.isUUID(confirmation_code)) {
      throw new BadRequest([{ confirmation_code: "Confirmation code is invalid" }]);
    }

    const Model = model(resources.user);
    Model.user = coreUser;
    const entity = await Model.verify({
      confirmation_code,
    });
    if (!entity[0]) {
      throw new NotFound("Verification code not found");
    }
    ctx.body = entity[0];
  });

module.exports = router;
