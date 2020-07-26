"use strict";

const timeout = require("koa-timeout-v2");
const fs = require("fs");
const path = require("path");
const cors = require("@koa/cors");
const responseTime = require("koa-response-time");
const morgan = require("koa-morgan");
const session = require("koa-session");
const passport = require("koa-passport");
const helmet = require("koa-helmet");
const Koa = require("koa");
const app = new Koa();
const Sentry = require("@sentry/node");

const config = require("./.env");
const { mogranPredefinedFormats } = require("./libraries/utils");
const errorHandler = require("./libraries/error_handler");
// const sse = require("./libraries/sse");
// const { api, resources } = require("./constants");

if (process.env.NODE_ENV == "production") {
  Sentry.init(config.sentry);
}

app.use(helmet());
// sessions
app.keys = [config.session.secret];
app.use(session(config.session.config, app));

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
      uploadDir: `${__dirname}/../${config.formidable.destination}`,
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

/**
 * koa sse middleware
 * @param {Object} opts
 * @param {Number} opts.maxClients max client number, default is 10000
 * @param {Number} opts.pingInterval heartbeat sending interval time(ms), default 60s
 * @param {String} opts.closeEvent if not provide end([data]), send default close event to client, default event name is "close"
 * @param {String} opts.matchQuery when set matchQuery, only has query (whatever the value) , sse will create
 */
// app.use(
//   sse({
//     // matchQuery: `/${api.v4}/${resources.events}`,
//     matchQuery: resources.events,
//   })
// );

// app.use(async (ctx) => {
//   // ctx.sse is a writable stream and has extra method 'send'
//   ctx.sse.send("a notice");
//   // ctx.sse.sendEnd();
// });

module.exports = app;
