# Installation process

After copy current version source code go to the root path

```bash
cd tape/
```

Then run installer with `sudo`

```bash
sudo ./install.sh
```

What they do:

1. Install main OS packages through `apt`:

   - `Nginx`
   - `Postgresql`
   - `Redis-server` (Key-value storage for user sessions and handling `tape` events)
   - `Certbot` (Automatically enable HTTPS on your website with EFF's Certbot)
   - `NodeJS`
   - `Yarn` (Yarn packagage manager like `npm`)
   - `KnexJS` (Query builder for Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle)
   - `PM2` (Daemon process manager that will help you manage and keep your application online 24/7)

2. Create database `tape` with user `tape` and grant privileges on database `tape`.

Don't forget after installation proccess save database user password and put it into `./backend/.env` file in `knex` section.

# Go to backend path

```bash
cd ../backend/
```

Be patient and add your server configuration environment variables:

```bash
vim .env.production
```

Add new `session.secret` key generated like:

```bash
openssl rand -base64 48
```

Put database credentials in `knex.production` section, get it from previous step:

```js
  ...,
  knex: {
    production: {
      connection: {
        database: "tape",
        user: "tape",
        password: "new_super_secret_password"
      }
    }
  },
  ...
```

Migrate schemas and seed if you need seeding data

```bash
knex migrate:latest --env production
knex seed:run --specific=002_fixtures.js --env production
```

Run backend server

```sh
pm2 start
```

# Go to frontend and build client

```bash
cd ../frontend/
```

Before building your bundles you need to change environment variables. Use `.env.production` file:

```sh
vim .env.production
```

Then run builder and copy build paths to the root server path

```sh
yarn build
sudo cp -R build/* ~/builds/app/
```

# Nginx configuration

To get ssl certificates run:

```sh
sudo certbot --nginx -d yourdomain.name -d img.yourdomain.name
```

Copy configuration files placed in root `/tape/config` path into `/etc/nginx/sites-available/`. Configure it with your domain names.

Don't forget to use your own root path to the upload directory. It placed in `img.nginx` file and looks like: `root /home/user/tape/frontend/public/uploads;`

Create symlink's:

```sh
sudo ln -s /etc/nginx/sites-available/default.nginx /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/img.nginx /etc/nginx/sites-enabled/
```

And restart `Nginx` server:

```sh
sudo systemctl restart nginx
```
