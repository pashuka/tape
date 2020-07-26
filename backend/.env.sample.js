module.exports = {
  server: {
    port: 3333,
    url: "http://localhost:3333",
  },
  client: {
    url: "http://localhost:3000",
  },
  jwt: {
    // openssl rand -base64 48
    secret: "hFnGhbHqQCvNgKKW7nSyRtZtQkIEF+rgiSJ7oKxMcA9npzzoyPZNHgDS5uSli2b3",
    expiresIn: 36000,
  },
  session: {
    // openssl rand -base64 48
    secret: "d29ePFBI0cvjhZKAc9Vd9WPfJZEOlEj2EVmpk3vBXxgc/ydPiVpEzZDjy+ceCwZ2",
  },
  knex: {
    development: {
      client: "pg",
      connection: {
        host: "localhost",
        user: "username",
        password: "userpassword",
        database: "databasename",
        charset: "utf8",
      },
      pool: { min: 0, max: 5 },
      migrations: { directory: __dirname + "/knex/migrations" },
      seeds: { directory: __dirname + "/knex/seeds" },
      debug: true,
    },
    staging: {
      client: "postgresql",
      connection: {
        host: "stage.psql.domain.name",
        user: "username",
        password: "userpassword",
        database: "databasename",
      },
      pool: { min: 2, max: 10 },
      migrations: { tableName: "knex_migrations" },
    },
    production: {
      client: "postgresql",
      connection: {
        host: "prod.psql.domain.name",
        user: "username",
        password: "userpassword",
        database: "databasename",
      },
      pool: { min: 2, max: 10 },
      migrations: { tableName: "knex_migrations" },
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
  sentry: {
    dsn: "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/xxxxxxxx",
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
};
