#!/usr/bin/env bash

date >> /home/pi/polly/switchmate.log 

/home/pi/polly/node_modules/node-switchmate/bin/toggle.switchmate fbd7e6af7963 $1 WvKK0A== >> /home/pi/polly/switchmate.log 2>&1

echo "----------------------------------" >> /home/pi/polly/switchmate.log


