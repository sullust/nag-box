#!/usr/bin/env bash

IFS='
'


if [[ -z $1 ]]; then echo "need input file"; exit 1; fi

SOURCE_FILE_DIR=$(dirname $1);
SOURCE_FILE_NAME=$(basename $1);

cd $SOURCE_FILE_DIR

/home/pi/polly/dropbox_uploader.sh download $SOURCE_FILE_NAME

DATE=$(date "+%I:%M%p");

echo $DATE;

OUT="{\"text\": \"<speak> <p>This is your nagg bot.</p>"
OUT="${OUT} <p>It's now $DATE.</p>"
OUT="${OUT} <p>Don't for get these things:</p>"

for i in `cat $1`; do
	OUT="${OUT} <p>${i}</p> "
done;

OUT="${OUT}</speak>\"}"

echo $OUT

curl -d $OUT -H "Content-Type: application/json" -X POST http://homebridge.local:3000/polly 
#curl https://graph-na02-useast1.api.smartthings.com/api/token/65d6b31d-f765-411c-a313-e4621e4a43e5/smartapps/installations/6e4734be-d632-4b15-ae85-d9f1bc137e1e/ifttt/nag_box
