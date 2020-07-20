const ExtendableError = require("es6-error");
const config = require("../.env");
const Sentry = require("@sentry/node");

process.env.NODE_ENV === "production" && Sentry.init(config.sentry);

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err);
    process.env.NODE_ENV === "production" && Sentry.captureException(err);
    if (err instanceof ExtendableError) {
      ctx.status = err.status;
      ctx.body = err.body;
    } else {
      ctx.status = 500;
      ctx.body = {
        errors: [
          {
            message: err.message,
            stack: process.env.NODE_ENV === "production" && err.stack // remove in production
          }
        ]
      };
    }
    ctx.app.emit("error", err, ctx);
  }
};
