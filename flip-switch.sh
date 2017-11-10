#!/usr/bin/env bash

date >> /home/pi/polly/switchmate.log 
echo $* >> /home/pi/polly/switchmate.log

NOW=$(date +%s)

if [[ $(pgrep -f toggle.switchmate.*$1) ]]; then
	echo "Found these pids: $(pgrep -f toggle.switchmate.*$1)" >> /home/pi/polly/switchmate.log
	pgrep -f toggle.switchmate.*$1 | sudo xargs kill -9 >> /home/pi/polly/switchmate.log
fi

if [[ -f /home/pi/polly/last-switch-run.$1.$2 ]]; then
	echo "Switch already $2, skipping..." >> /home/pi/polly/switchmate.log
	echo "----------------------------------" >> /home/pi/polly/switchmate.log
        exit 0
fi

rm /home/pi/polly/last-switch-run.$1.*

echo "running..." >> /home/pi/polly/switchmate.log

sudo /opt/nodejs/lib/node_modules/node-switchmate/bin/toggle.switchmate $1 $2 $3 == >> /home/pi/polly/switchmate.log 2>&1 

if [[ $? -eq 0 ]]; then
	touch /home/pi/polly/last-switch-run.$1.$2
fi

echo "----------------------------------" >> /home/pi/polly/switchmate.log


