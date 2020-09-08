#!/bin/bash

apt-get update
apt update
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get update

curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt -y install nginx postgresql postgresql-contrib curl dirmngr apt-transport-https lsb-release ca-certificates nodejs gcc g++ make yarn redis-server certbot python3-certbot-nginx

yarn global add knex
yarn global add pm2

# Install all dependencies for a project
yarn install

password=`cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1`
echo "This is the database credentials allow you to log into your database"
echo "user: tape, password: [${password}]"
echo "if you forget save this password then just run next sql command to set new"
echo "sql:"
echo "alter user tape with password 'new_secure_password';"
echo
sudo -i -u postgres psql \
 -c "create database tape;" \
 -c "create user tape with encrypted password '${password}';" \
 -c "grant all privileges on database tape to tape;" \
