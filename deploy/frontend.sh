#!/bin/bash

echo "Go to root project ~/.git path"
cd ..

echo "If you have git version of this product then we pull fresh updates from remote repository"
echo "Pull data from git"
git pull

echo
echo "Install packages"
yarn install --network-timeout=30000

cd ../frontend
echo
echo "Build"
yarn build

echo
echo "Don't forget to make 'builds' path in the root of the current user directory"
echo "Copy to builds path"
sudo cp -R build/* ~/builds/app/
