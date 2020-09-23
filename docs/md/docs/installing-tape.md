# Software and Hardware Requirements

This guide outlines minimum software and hardware requirements for deploying Tape. Requirements may vary based on utilization and observing performance of pilot projects is recommended prior to scale out.

## Software Requirements

### Client Software

#### [http](:Icon) Web

Web client for desktop, mobile and tablet browsers.

| Browser | Version |
| ------- | ------- |
| Chrome  | - v77+  |
| Firefox | - v68+  |
| Safari  | - v12+  |
| Edge    | - v44+  |

### [mail_outline](:Icon) Email Client

- **Desktop clients**: Outlook 2010+, Apple Mail version 7+, Thunderbird 38.2+
- **Web based clients**: Office 365, Outlook, Gmail, Yahoo, AOL
- **Mobile clients**: iOS Mail App (iOS 7+), Gmail Mobile App (Android, iOS)

## Server Software

### Tape Server Operating System

- Ubuntu 18.04, Debian Buster, CentOS 6+, CentOS 7+, RedHat Enterprise Linux 7+, Oracle Linux 6+, Oracle Linux 7+.
- For custom requests it's possible to usinget the Tape `Docker IMAGE` on a Docker-compatible operating system (Linux-based OS).

### Database Software

- PostgreSQL 9.4+
- Redis 4.0+

## Hardware Requirements

Usage of CPU, RAM, and storage space can vary significantly based on user behavior. These hardware recommendations are based on traditional deployments and may grow or shrink depending on how active your users are.

Moreover, memory requirements can be driven by peak file sharing activity. Recommendation is based on default 50 MB maximum file size, which can be adjusted from the System Console. Changing this number may change memory requirements.

### [people_outline](:Icon) Hardware Requirements for Team Deployments

Most small to medium Tape team deployments can be supported on a single server with the following specifications based on registered users:

| Count users         | Hardware Requirements   |
| ------------------- | ----------------------- |
| 1 - 1,000 users     | 1 vCPU/cores, 2 GB RAM  |
| 1,000 - 2,000 users | 2 vCPUs/cores, 4 GB RAM |

### Hardware Requirements for Multi-Server Deployments

#### Scale Requirements

It is highly recommended that pilots are run before enterprise-wide deployments in order to estimate full scale usage based on your specific organizational needs.

#### System Requirements

For Enterprise Edition deployments with a multi-server setup, we highly recommend the following systems to support your Tape deployment:

- Prometheus to track system health of your Tape deployment.
- Grafana to visualize the system health metrics collected by Prometheus. Grafana 5.0.0 and later is recommended.

### [storage](:Icon) Storage Calculations

As an alternative to recommended storage sizing above, you can forecast your own storage usage. Begin with a Server approximately 600 MB to 800 MB in size including operating system and database, then add the multiplied product of:

- Estimated storage per user per month, multipled by 12 months in a year
- Estimated mean average number of users in a year
- A 1-2x safety factor

> [info](:Icon) **INFORMATION**
>
> It’s recommended that you review storage utilization at least quarterly to ensure adequate free space is available.

---

# Introduction

A complete Tape installation consists of four major components: a proxy server, a database server, a redis server and the Tape server. You can install all components on one machine, or you can install each component on its own machine. If you have only two machines, then install the proxy and the Tape server on one machine, and install the database on the other machine.

For the database, you can install PostgreSQL. The proxy is NGINX.

> [help](:Icon) **NOTE**
>
> If you have any problems installing then please raise an issue on github.

Install and configure the components in the following order. Note that you need only one OS, either Ubuntu Server 18.04 LTS or Ubuntu Server 20.04 LTS.

---

# Installing Ubuntu Server 18.04 LTS

Install the 64-bit version of Ubuntu Server on each machine that hosts one or more of the components. To install Ubuntu Server 18.04, see the [Ubuntu 18.04 Installation Guide](https://help.ubuntu.com/18.04/installation-guide/amd64/index.html).

After the system is installed, make sure that it’s up to date with the most recent security patches. Open a terminal window and issue the following commands:

```
sudo apt update
```

```
sudo apt upgrade
```

Now that the system is up to date, you can start installing the components that make up a Tape system.

---

# Installing Ubuntu Server 20.04 LTS

Install the 64-bit version of Ubuntu Server on each machine that hosts one or more of the components. To install Ubuntu Server 20.04, see the [Ubuntu 20.04 Installation Guide](https://help.ubuntu.com/20.04/installation-guide/amd64/index.html).

After the system is installed, make sure that it’s up to date with the most recent security patches. Open a terminal window and issue the following commands:

```bash
sudo apt update
```

```bash
sudo apt upgrade
```

Now that the system is up to date, you can start installing the components that make up a Tape system.

---

# Installing PostgreSQL Database Server

Install and set up the database for use by the Tape server.

Assume that the IP address of this server is `10.10.10.1`.

1.  Log in to the server that will host the database and issue the following command:

    ```bash
    sudo apt install postgresql postgresql-contrib
    ```

    When the installation is complete, the PostgreSQL server is running, and a Linux user account called _postgres_ has been created.

2.  Log in to the _postgres_ account.

    ```bash
    sudo --login --user postgres
    ```

3.  Start the PostgreSQL interactive terminal.

    ```bash
    psql
    ```

4.  Create the Tape database.

    ```sql
    CREATE DATABASE tape;
    ```

5.  Create the Tape user 'tapeuser'.

    ```sql
    CREATE USER tapeuser WITH PASSWORD 'tapeuser-password';
    ```

    > [info](:Icon) **NOTE**
    >
    > Use a password that is more secure than 'tapeuser-password'.

6.  Grant the user access to the Tape database.

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE tape to tapeuser;
    ```

7.  Exit the PostgreSQL interactive terminal.

    ```
    postgres=# \q
    ```

8.  Log out of the _postgres_ account.

    ```bash
    exit
    ```

9.  Optional

    If you use a different server for your database and the Tape server, you may allow PostgreSQL to listen on all assigned IP Addresses. To do so, open `/etc/postgresql/10/main/postgresql.conf` as root in a text editor. As a best practice, ensure that only the Tape server is able to connect to the PostgreSQL port using a firewall.

    Find the following line, uncomment it the line and change `localhost` to `*`:

        /*-*/    #listen_addresses = 'localhost'
        /*+*/    listen_addresses = '*'

10. Modify the file `pg_hba.conf` to allow the Tape server to communicate with the database.

    **10.1. For case when the Tape server and the database are on the same machine**:

    a) Open `/etc/postgresql/10/main/pg_hba.conf` as root in a text editor.

    b) Find the following line and change `peer` to `trust`:

        /*-*/    local   all             all                        peer
        /*+*/    local   all             all                        trust

    **10.2. For case when the Tape server and the database are on different machines**:

    a) Open `/etc/postgresql/10/main/pg_hba.conf` as root in a text editor.

    b) Add the following line to the end of the file, where _{tape-server-IP}_ is the IP address of the machine that contains the Tape server.

        host all all {tape-server-IP}/32 md5

11. Reload PostgreSQL:

    ```bash
    sudo systemctl reload postgresql
    ```

12. Verify that you can connect with the user _tapeuser_.

    a) If the Tape server and the database are on the same machine, use the following command:

    ```bash
    psql --dbname=tape --username=tapeuser --password
    ```

    b) If the Tape server is on a different machine, log into that machine and use the following command:

    ```bash
    psql --host={postgres-server-IP} --dbname=tape --username=tapeuser --password
    ```

    > [help](:Icon) **NOTE**
    >
    > You might have to install the PostgreSQL client software to use the command.

    The PostgreSQL interactive terminal starts. To exit the PostgreSQL interactive terminal, type `\q` and press **Enter**.

With the database installed and the initial setup complete, you can now install the Tape server.

---

# Installing and Configuring Redis

In order to get the latest version of Redis, we will use apt to install it from the official Ubuntu repositories.

Install Redis by typing:

```bash
sudo apt install redis-server
```

This will download and install Redis and its dependencies. Following this, there is one important configuration change to make in the Redis configuration file, which was generated automatically during the installation.

Open this file with your preferred text editor:

```bash
sudo nano /etc/redis/redis.conf
```

Inside the file, find the `supervised` directive. This directive allows you to declare an init system to manage Redis as a service, providing you with more control over its operation. The `supervised` directive is set to `no` by default. Since you are running Ubuntu, which uses the `systemd` init system, change this to `systemd`:

```bash | /etc/redis/redis.conf
. . .

# If you run Redis from upstart or systemd, Redis can interact with your
# supervision tree. Options:
#   supervised no      - no supervision interaction
#   supervised upstart - signal upstart by putting Redis into SIGSTOP mode
#   supervised systemd - signal systemd by writing READY=1 to $NOTIFY_SOCKET
#   supervised auto    - detect upstart or systemd method based on
#                        UPSTART_JOB or NOTIFY_SOCKET environment variables
# Note: these supervision methods only signal "process is ready."
#       They do not enable continuous liveness pings back to your supervisor.
supervised systemd

. . .
```

That’s the only change you need to make to the Redis configuration file at this point, so save and close it when you are finished. Then, restart the Redis service to reflect the changes you made to the configuration file:

```bash
sudo systemctl restart redis.service
```

With that, you’ve installed and configured Redis and it’s running on your machine. Before you begin using it, though, it’s prudent to first check whether Redis is functioning correctly.

---

# Installing Node.js using a PPA

To get a more recent version of Node.js you can add the PPA (personal package archive) maintained by [NodeSource](https://nodesource.com/). This will have more up-to-date versions of `Node.js` than the official Ubuntu repositories, and will allow you to choose between Node.js v10.x (the Maintenance LTS version, supported until April of 2021), Node.js v12.x (the Active LTS version, supported until April 2022), and Node.js v14.x (the current release, supported until April 2023).

First, install the PPA in order to get access to its contents. From your home directory, use curl to retrieve the installation script for your preferred version, making sure to replace 12.x with your preferred version string (if different):

```bash
cd ~
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
```

You can inspect the contents of this script with nano (or your preferred text editor):

```bash
vim nodesource_setup.sh
```

Run the script under sudo:

```bash
sudo bash nodesource_setup.sh
```

The PPA will be added to your configuration and your local package cache will be updated automatically. After running the setup script from Nodesource, you can install the Node.js package in the same way you did above:

```bash
sudo apt update && sudo apt install nodejs
```

To check which version of Node.js you have installed after these initial steps, type:

```bash
nodejs -v
```

---

# Install necessary dependency packages

## Yarn

On Debian or Ubuntu Linux, you can install [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) via Debian package repository. You will first need to configure the repository:

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

Then you can simply:

```bash
sudo apt update && sudo apt install yarn
```

## Knex.js migration CLI

The migration CLI is bundled with the knex install, and is driven by the node-liftoff module. To install globally, run:

```bash
sudo yarn global add knex
```

---

# Installing Tape Server

Install Tape Server on a 64-bit machine.

Assume that the IP address of this server is 10.10.10.2.

**To install Tape Server on Ubuntu**

1. Log in to the server that will host Tape Server and open a terminal window.

2. Download the latest version of the Tape Server on [codecanyon.net](https://codecanyon.net/user/buildpm/).

3. Extract the Tape Server files.

   ```bash
   tar -xvzf tape.X.X.X.gz
   ```

4. Create server environment file:

   ```bash
   cd ./tape/backend/
   cp .env.sample.js .env
   ```

   > [help](:Icon) **NOTE**
   >
   > Be patient and add your server configuration environment variables.

5. Set up the database environments in the file `./tape/.env`. Open the file in a text editor and make the following changes:

   - If you are using PostgreSQL:

     Set `"knex.production"` to the following value, replacing `<username>`, `<userpassword>`, `<host-name-or-IP>` and `<databasename>` with the appropriate values:
     `"postgres://<username>:<userpassword>@<host-name-or-IP>:5432/<databasename>?sslmode=disable&connect_timeout=10"`.

6. Also set `"client.url"` to the full base URL of the site (e.g. `"https://tape.example.com"`).

7. Add new `session.secret` key generated for example using `openssl`:

   ```bash
   openssl rand -base64 48
   ```

8. Update `nodemailer` configuration section follow this topic [Nodemailer Usage](https://nodemailer.com/usage/).

   > Nodemailer uses for sending out verify, welcome, reset password emails and others

9. Migrate database schemas

   ```bash
   knex migrate:latest --env production
   ```

10. Go to frontend and build client

    ```bash
    cd ../frontend/
    ```

    Before building your client bundle we need to change environment variables. Use `.env.production` file:

    ```bash
    vim .env.production
    ```

    Then run builder:

    ```bash
    yarn build
    ```

11. Move the extracted file to the `/opt` directory.

    ```bash
    sudo mv tape /opt
    ```

12. Create the storage directory for files.

    ```bash
    sudo mkdir /opt/tape/frontend/build/uploads
    ```

    > [help](:Icon) **NOTE**
    >
    > The storage directory will contain all the files and images that your users post to Tape, so you need to make sure that the drive is large enough to hold the anticipated number of uploaded files and images.

13. Set up a system user and group called `thetape` that will run this service, and set the ownership and permissions.

    a. Create the Tape user and group:

    ```bash
    sudo useradd --system --user-group thetape
    ```

    b. Set the user and group _thetape_ as the owner of the Tape files:

    ```bash
    sudo chown -R thetape:thetape /opt/tape
    ```

    c. Give write permissions to the _thetape_ group:

    ```bash
    sudo chmod -R g+w /opt/tape
    ```

14. Test the Tape server to make sure everything works.

    a. Change to the `tape` directory:
    `cd /opt/tape`

    b. Start the Tape server as the user tape:
    `sudo -u thetape NODE_ENV=production /usr/bin/node ./server.js`

    When the server starts, it shows some log information and the text `API listening on port 3333`. You can stop the server by pressing CTRL+C in the terminal window.

15. Setup Tape to use _systemd_ for starting and stopping.

    a. Create a _systemd_ unit file:
    `sudo touch /lib/systemd/system/tape.service`

    b. Open the unit file as root in a text editor, and copy the following lines into the file:

    ```cmake
    [Unit]
    Description=Tape
    After=network.target
    After=nss-lookup.target
    After=nginx.target
    After=postgresql.service
    BindsTo=postgresql.service

    [Service]
    Type=notify
    ExecStart=/usr/bin/node /opt/tape/backend/server.js
    TimeoutStartSec=3600
    Restart=always
    RestartSec=10
    WorkingDirectory=/opt/tape/backend
    User=thetape
    Group=thetape
    LimitNOFILE=49152
    Environment=NODE_ENV=production

    [Install]
    WantedBy=postgresql.service
    ```

    > [help](:Icon) **NOTE**
    >
    > If you have installed PostgreSQL on a dedicated server, then you need to

    - remove `After=postgresql.service` and `BindsTo=postgresql.service` or `After=mysql.service` and `BindsTo=mysql.service` lines in the `[Unit]` section, and
    - replace the `WantedBy=postgresql.service` or `WantedBy=mysql.service` line in the `[Install]` section with `WantedBy=multi-user.target`

    or the Tape service will not start.

    > [help](:Icon) **NOTE**
    >
    > Setting `WantedBy` to your local database service ensures that whenever the database service is started, the Tape server starts too. This prevents the Tape server from stopping to work after an automatic update of the database.

    c. Make systemd load the new unit.

    ```bash
    sudo systemctl daemon-reload
    ```

    d. Check to make sure that the unit was loaded.

    ```bash
    sudo systemctl status tape.service
    ```

    You should see an output similar to the following:

    ```
      ● tape.service - Tape
        Loaded: loaded (/lib/systemd/system/tape.service; disabled; vendor preset: enabled)
        Active: inactive (dead)
    ```

    e. Start the service.

    ```bash
    sudo systemctl start tape.service
    ```

    f. Verify that Tape is running.

    ```bash
    curl http://localhost:3333/
    ```

    You should see the text `Not Found` that's returned by the Tape server.

    g. Set Tape to start on machine start up.

    ```bash
    sudo systemctl enable tape.service
    ```

Now that the Tape server is up and running, you can do some initial configuration and setup.

---

# Installing NGINX Server

In a production setting, use a proxy server for greater security and performance of Tape.

The main benefits of using a proxy are as follows:

- SSL termination
- HTTP to HTTPS redirect
- Port mapping `:80` to `:3333` for rest service
- Standard request logs

**To install NGINX on Ubuntu Server:**

1. Log in to the server that will host the proxy and open a terminal window.

2. Install NGINX.

   ```bash
   sudo apt-get install nginx
   ```

3. After the installation is complete, verify that NGINX is running.

   ```bash
   curl http://localhost
   ```

   If NGINX is running, you see the following output:

   ```html
   <!DOCTYPE html>
   <html>
   <head>
   <title>Welcome to nginx!</title>
   <p><em>Thank you for using nginx.</em></p>
   </body>
   </html>
   ```

   You can stop, start, and restart NGINX with the following commands:

   ```bash
   sudo systemctl stop nginx
   sudo systemctl start nginx
   sudo systemctl restart nginx
   ```

**What to do next**

1. Map a fully qualified domain name (FQDN) such as `tape.example.com` to point to the NGINX server.
2. Configure NGINX to proxy connections from the internet to the Tape Server.

---

# Configuring NGINX as a proxy for Tape Server

NGINX is configured using a file in the `/etc/nginx/sites-available` directory. You need to create the file and then enable it. When creating the file, you need the IP address of your Tape server and the fully qualified domain name (FQDN) of your Tape website.

**To configure NGINX as a proxy**

1. Log in to the server that hosts NGINX and open a terminal window.
2. Create a configuration file for Tape.

   ```bash
   sudo touch /etc/nginx/sites-available/tape
   ```

3. Open the file `/etc/nginx/sites-available/tape` as root in a text editor and replace its contents, if any, with the following lines. Make sure that you use your own values for the Tape server IP address and FQDN for _server_name_.

   ```nginx
   upstream backend {
     server 127.0.0.1:3333;
     keepalive 32;
   }

   proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=tape_cache:10m max_size=3g inactive=120m use_temp_path=off;

   server {
     listen 80 default_server;
     server_name tape.example.com;

     access_log /var/log/nginx/tape.access.log;
     error_log /var/log/nginx/tape.error.log;

     root /opt/tape/frontend/build;
     index index.html;
     location / {
       if (!-e $request_filename) {
         rewrite ^(.*)$ /index.html break;
       }
     }
     location ~ ^/(v4)/ {
       client_max_body_size 50M;
       proxy_set_header Connection "";
       proxy_set_header Host $http_host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header X-Frame-Options SAMEORIGIN;
       proxy_buffers 256 16k;
       proxy_buffer_size 16k;
       proxy_read_timeout 600s;
       proxy_cache tape_cache;
       proxy_cache_revalidate on;
       proxy_cache_min_uses 2;
       proxy_cache_use_stale timeout;
       proxy_cache_lock on;
       proxy_http_version 1.1;
       proxy_pass http://backend;
     }
   }
   ```

4. Remove the existing default sites-enabled file.

   ```bash
   sudo rm /etc/nginx/sites-enabled/default
   ```

5. Enable the tape configuration.

   ```bash
   sudo ln -s /etc/nginx/sites-available/tape /etc/nginx/sites-enabled/tape
   ```

6. Restart NGINX.

   ```bash
   sudo systemctl restart nginx
   ```

7. Verify that you can see Tape through the proxy.

   ```bash
   curl http://localhost
   ```

   If everything is working, you will see the HTML for the Tape signin page.

Now that NGINX is installed and running, you can configure it to use SSL, which allows you to use HTTPS connections and the HTTP/2 protocol.

---

# Configuring NGINX with SSL and HTTP/2

Using SSL gives greater security by ensuring that communications between Tape clients and the Tape server are encrypted. It also allows you to configure NGINX to use the HTTP/2 protocol.

Although you can configure HTTP/2 without SSL, both Firefox and Chrome browsers support HTTP/2 on secure connections only.

You can use any certificate that you want, but these instructions show you how to download and install certificates from [Let's Encrypt](https://letsencrypt.org), a free certificate authority.

**To configure SSL and HTTP/2:**

1. Log in to the server that hosts NGINX and open a terminal window.
2. Install git.

   ```bash
   sudo apt-get install git
   ```

3. Clone the Let's Encrypt repository on GitHub.

   ```bash
   git clone https://github.com/letsencrypt/letsencrypt
   ```

4. Change to the `letsencrypt` directory.

   ```bash
   cd letsencrypt
   ```

5. Stop NGINX.

   ```bash
   sudo systemctl stop nginx
   ```

6. Run `netstat` to make sure that nothing is listening on port 80.

   ```bash
   netstat -na | grep ':80.*LISTEN'
   ```

7. Run the Let's Encrypt installer.

   ```bash
   ./letsencrypt-auto certonly --standalone
   ```

   When prompted, enter your domain name. After the installation is complete, you can find the certificate in the `/etc/letsencrypt/live` directory.

8. Open the file `/etc/nginx/sites-available/tape` as root in a text editor and update the _server_ section to incorporate the highlighted lines in the following sample.

   ```nginx
   ...
   /*+*/server {
   /*+*/  listen 80 default_server;
   /*+*/  server_name   tape.example.com;
   /*+*/  return 301 https://$server_name$request_uri;
   /*+*/}

   server {
   /*+*/  listen 443 ssl http2;
     server_name    tape.example.com;

   /*+*/  ssl on;
   /*+*/  ssl_certificate /etc/letsencrypt/live/tape.example.com/fullchain.pem;
   /*+*/  ssl_certificate_key /etc/letsencrypt/live/tape.example.com/privkey.pem;
   /*+*/  ssl_session_timeout 1d;
   /*+*/  ssl_protocols TLSv1.2;
   /*+*/  ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
   /*+*/  ssl_prefer_server_ciphers on;
   /*+*/  ssl_session_cache shared:SSL:50m;
   /*+*/  # HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
   /*+*/  add_header Strict-Transport-Security max-age=15768000;
   /*+*/  # OCSP Stapling ---
   /*+*/  # fetch OCSP records from URL in ssl_certificate and cache them
   /*+*/  ssl_stapling on;
   /*+*/  ssl_stapling_verify on;
     ...
   }
   ```

9. Start NGINX.

   ```bash
   sudo systemctl start nginx
   ```

10. Check that your SSL certificate is set up correctly.

    - Test the SSL certificate by visiting a site such as https://www.ssllabs.com/ssltest/index.html
    - If there’s an error about the missing chain or certificate path, there is likely an intermediate certificate missing that needs to be included.

11. Configure `cron` so that the certificate will automatically renew every month.

    ```bash
    crontab -e
    ```

    In the following line, use your own domain name in place of `tape.example.com`.

    ```bash
    @monthly /home/ubuntu/letsencrypt/letsencrypt-auto certonly --reinstall --nginx -d tape.example.com && sudo systemctl restart nginx
    ```
