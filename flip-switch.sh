#!/usr/bin/env bash

date >> /home/pi/polly/switchmate.log 

pgrep -f toggle.switchmate | xargs kill -9

/usr/lib/node_modules/node-switchmate/bin/toggle.switchmate $1 $2 $3 == >> /home/pi/polly/switchmate.log 2>&1 &

echo "----------------------------------" >> /home/pi/polly/switchmate.log


