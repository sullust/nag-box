#!/usr/bin/env bash

IFS='
'


if [[ -z $1 ]]; then echo "need input file"; exit 1; fi

SOURCE_FILE_DIR=$(dirname $1);
SOURCE_FILE_NAME=$(basename $1);

cd $SOURCE_FILE_DIR

/home/pi/polly/dropbox_uploader.sh download $SOURCE_FILE_NAME

dos2unix $SOURCE_FILE_NAME

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

OUT_FILE=$(curl -s -d $OUT -H "Content-Type: application/json" -X POST http://10.0.1.247:3000/polly  | sed 's/.* //g')
echo "Playing: $OUT_FILE"

#curl -u :sullnet "http://10.0.1.247:43822/requests/status.xml?command=volume&val=175"
#curl -u :sullnet http://10.0.1.247:43822/requests/status.xml?command=pl_empty
#curl -u :sullnet "http://10.0.1.247:43822/requests/status.xml?command=in_enqueue&input=$OUT_FILE"
#curl -u :sullnet "http://10.0.1.247:43822/requests/status.xml?command=pl_play"

/usr/bin/amixer set PCM -- -700
/usr/bin/cvlc --play-and-exit $OUT_FILE
