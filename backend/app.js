"use strict";

const timeout = require("koa-timeout-v2");
const fs = require("fs");
const path = require("path");
const cors = require("@koa/cors");
const responseTime = require("koa-response-time");
const morgan = require("koa-morgan");
const session = require("koa-session");
const sessionStore = require("koa-redis")({
  // Options specified here
});
const passport = require("koa-passport");
const helmet = require("koa-helmet");
const Koa = require("koa");
const app = new Koa();
const Sentry = require("@sentry/node");

const config = require("./.env");
const { mogranPredefinedFormats } = require("./libraries/utils");
const errorHandler = require("./libraries/error_handler");

if (process.env.NODE_ENV == "production") {
  Sentry.init(config.sentry);
}

app.use(helmet());
// sessions
app.keys = [config.session.secret];
app.use(session({ ...config.session.config, store: sessionStore }, app));

app.use(responseTime());

if (mogranPredefinedFormats[process.env.NODE_ENV]) {
  app.use(morgan(mogranPredefinedFormats[process.env.NODE_ENV]));
}

// enable cors
app.use(cors());

// static files
app.use(require("koa-static")("./public"));

// request parameters parser
app.use(
  require("koa-body")({
    formidable: {
      // This is where the files will be uploaded
      uploadDir: `${process.cwd()}/${config.formidable.destination}`,
      keepExtensions: true,
    },
    // formLimit: "2mb",
    // textLimit: "2mb",
    // jsonLimit: "2mb",
    multipart: true,
    urlencoded: true,
  })
);

// error handler
app.use(errorHandler);

app.use(
  timeout(5 * 1000, {
    status: 503,
    message: "Service Unavailable",
  })
);

// authentication
require("./libraries/passport");
app.use(passport.initialize());
app.use(passport.session());

// validator
require("koa-validate")(app);

// set routes
const useFile = (file) => {
  if (!/\.spec|test\.js$/.test(file) && path.extname(file).toLowerCase() === ".js") {
    app.use(require("./" + file).routes());
  }
};

const useDirectory = (dir) => {
  const paths = fs.readdirSync(dir).map((_) => path.join(dir, _));
  paths.filter((_) => fs.statSync(_).isFile()).forEach((_) => useFile(_));
  paths.filter((_) => fs.statSync(_).isDirectory()).forEach((_) => useDirectory(_));
};

useDirectory("./api");

app.on("error", (err) => {
  // console.error("Server error", err);
});

module.exports = app;
