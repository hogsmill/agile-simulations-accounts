#!/bin/bash

if [ "$1" == "-f" ]; then
  FORCE=true
fi

git stash
GIT=`git pull`
echo $GIT
if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
  exit 0
fi

npm install --legacy-peer-deps
npm run build
rm /var/www/html/agilesimulations-accounts/css/*
rm /var/www/html/agilesimulations-accounts/js/*
cp -R dist/* /var/www/html/agilesimulations-accounts
