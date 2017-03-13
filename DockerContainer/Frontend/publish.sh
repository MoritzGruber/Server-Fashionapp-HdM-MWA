#!/usr/bin/env bash
sudo rm -r /var/www/html;
sudo mkdir /var/www/html;
sudo cp -r . /var/www/html;
cd /var/www/html;
sudo npm install && sudo bower install --allow-root;