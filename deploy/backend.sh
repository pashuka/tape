#!/bin/bash

echo "Go to root project ~/.git path"
cd ..

echo "If you have git version of this product then we pull fresh updates from remote repository"
echo "Pull data from git"
git pull

echo
echo "Install packages"
yarn install --network-timeout=30000

echo "Restart node by: pm2 restart server"
pm2 restart api
