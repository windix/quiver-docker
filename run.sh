#!/bin/sh

SOURCE_JSON_FILE=tmp.json
DB_FILE=/data/quiver.db

cd /app

pipenv run python quiver-parser.py ${QUIVER_DIR} > ${SOURCE_JSON_FILE}

if ! [ -f ${DB_FILE} ]; then
  pipenv run sqlite-utils upsert --pk uuid ${DB_FILE} quiver ${SOURCE_JSON_FILE}
  pipenv run sqlite-utils enable-fts --create-triggers ${DB_FILE} quiver title contents
fi

pipenv run sqlite-utils upsert --pk uuid ${DB_FILE} quiver ${SOURCE_JSON_FILE}

echo FINISH `date`
