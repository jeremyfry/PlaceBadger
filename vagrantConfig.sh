#!/usr/bin/env bash

echo "Provision VM START"
echo "=========================================="

echo "Setting name servers"
echo "nameserver 8.8.8.8" | tee /etc/resolv.conf > /dev/null
# Add DNS for future sessions
echo "nameserver 8.8.8.8" | tee /etc/resolvconf/resolv.conf.d/base > /dev/null

sudo apt-get update

echo "Git Install"
echo "=========================================="

#install git
sudo apt-get -y install git
sudo apt-get -y install libcairo2-dev

echo "Node Install"
echo "=========================================="

#install nodjs
sudo apt-get update
sudo apt-get -y install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get -y install nodejs
sudo apt-get -y install npm

echo "Mongo Install"
echo "=========================================="

#install mongo db
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get -y install mongodb-org
sudo apt-get update

echo "NPM Base Install"
echo "=========================================="

#install base npm packages
sudo npm install -g nodemon

echo ""
echo "=========================================="
echo "Node setup:"
node -v
echo "***********************************************************"
echo "You must edit /etc/mongod.conf and comment line 'bind_ip' to listen all interfaces (and restart mongodb 'service mongod stop', 'service mongod start')"
echo "***********************************************************"
echo ""
echo "Provision VM finished"