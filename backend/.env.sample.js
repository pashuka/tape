module.exports = {
  server: {
    port: 3333,
    url: "http://localhost:3333",
  },
  client: {
    url: "http://localhost:3000",
  },
  session: {
    // openssl rand -base64 48
    secret: "d29ePFBI0cvjhZKAc9Vd9WPfJZEOlEj2EVmpk3vBXxgc/ydPiVpEzZDjy+ceCwZ2",
    config: {
      key: "sess" /** (string) cookie key (default is koa:sess) */,
      /** (number || 'session') maxAge in ms (default is 1 days) */
      /** 'session' will result in a cookie that expires when session/browser is closed */
      /** Warning: If a session cookie is stolen, this cookie will never expire */
      maxAge: 14 * 24 * 60 * 60 * 1e3,
      autoCommit: true /** (boolean) automatically commit headers (default true) */,
      overwrite: true /** (boolean) can overwrite or not (default true) */,
      httpOnly: true /** (boolean) httpOnly or not (default true) */,
      signed: true /** (boolean) signed or not (default true) */,
      rolling: true /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
      renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
    },
  },
  knex: {
    production: {
      client: "postgresql",
      connection:
        "postgres://<username>:<userpassword>@<psql.domain.name>:5432/<databasename>?sslmode=disable&connect_timeout=10",
      pool: { min: 2, max: 10 },
      migrations: { tableName: "knex_migrations", directory: __dirname + "/knex/migrations" },
      seeds: { directory: __dirname + "/knex/seeds" },
      debug: false,
    },
  },
  seed: {
    users: [
      {
        realname: "John Doe",
        username: "john",
        email: "john.doe@domain.name",
        password: "secret password",
        role: "user",
      },
    ],
  },
  nodemailer: {
    send: false,
    preview: true,
    transport: {
      jsonTransport: true,
      service: "Yahoo/Google/Yandex",
      auth: {
        user: "email@brand.name",
        pass: "password",
      },
    },
    options: {
      from: "Brand Name <email@brand.name>",
      to: "test@brand.name",
      subject: "-subject-",
      text: "-body-",
      html: "<p>-body-</p>",
    },
  },
  redis: {
    host: "localhost",
    port: 6379,
  },
  sentry: {
    // dsn: "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/xxxxxxxx",
    dsn: false,
  },
  formidable: {
    destination: "../frontend/build/uploads",
    docs: ["file"],
    thumb: {
      size: 64,
      prefix: "thumb-",
    },
  },
};
