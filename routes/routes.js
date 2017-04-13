// Load the SDK

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http");
var url = require("url");

const AWS = require('aws-sdk')
const Fs = require('fs')

// Create an Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
})


var appRouter = function(app) {

    app.get("/run", function(req, res) {
        var exec = require('child_process').exec;
        var cmd = '/home/pi/announceList.sh /home/pi/for-reals.txt';

        exec(cmd, function(error, stdout, stderr) {});

        return res.send("");

    });

    app.post("/polly", function(req, res) {
        if (!req.body.text) {
            return res.send({
                "status": "error",
                "message": "missing a parameter"
            });
        } else {

            let params = {
                'Text': req.body.text,
                'OutputFormat': 'mp3',
                'VoiceId': 'Salli',
                'TextType': 'ssml'
            }

            Polly.synthesizeSpeech(params, (err, data) => {
                if (err) {
                    console.log(err.code)
                } else if (data) {
                    if (data.AudioStream instanceof Buffer) {
                        const uuidV4 = require('uuid/v4');
                        file = "./" + uuidV4() + ".mp3"
                        Fs.writeFile(file, data.AudioStream, function(err) {
                            if (err) {
                                return console.log(err)
                            }
                            console.log("The file was saved: " + file + "\n")

                            var exec = require('child_process').exec;
                            var cmd = 'cvlc file:///home/pi/polly/' + file + ' vlc://quit';

                            exec(cmd, function(error, stdout, stderr) {});
                            return res.send("The file was saved and played!")
                        })
                    }
                }
            })

        }
    });

    app.post("/switch", function(req, res) {
        var parsedUrl = url.parse(req.url, true); // true to get query as object
        var queryAsObject = parsedUrl.query;
        console.log(queryAsObject);
        if (!queryAsObject.onoff) {
            //      console.log(req);
            return res.send({
                "status": "error",
                "message": "missing a parameter"
            });
        } else {
            var args = ['foo', 'bar', '72bc13fb550b46339a4ac04487f7f4f8', queryAsObject.onoff, 'WvKK0A=='];
            console.log("requested: " + req.body.onoff + "\n");

            var SwitchmateDevice = require('./node_modules/node-switchmate/index').SwitchmateDevice;
            (validateArgs()) ? createToggleSession(): displayUsage();


            /**
             * Validate commandline arguments.
             * @returns {Boolean} True on valid, false on invalid.
             */
            function validateArgs() {
                console.log(args);
                var valid = (args.length >= 4);
                var invalidDataType = (typeof args[2] === 'undefined' || typeof args[3] === 'undefined' || typeof args[4] === 'undefined');
                valid = valid && !invalidDataType;
                valid = valid && (args[3] === 'on' || args[3] === 'off' || args[3] === 'identify');
                return valid;
            }

            /**
             * Find the Switchmate and create the Toggle Session when found.
             */
            function createToggleSession() {
                var sm_id = args[2].toLowerCase();
                console.log('Locating ' + sm_id + '.');
                SwitchmateDevice.discoverById(sm_id, onFound);
            }

            /**
             * Display command line usage, then exit.
             */
            function displayUsage() {
                console.log('Usage for toggle.switchmate:');
                console.log('Set Switchmate to a certain target state (on, off, identify)\n');
                console.log('toggle.switchmate <switchmate_id> <target_state> <auth_code>\n');
                process.exit();
            }

            function onFound(Switchmate) {
                console.log('found');
                var auth = args[4];
                var targetState = args[3];
                Switchmate.setAuthCode(auth);
                ToggleMode = Switchmate.ToggleMode();
                //ToggleMode = new SwitchmateToggle(Switchmate);

                ToggleMode.event.on('msg', function(msg) {
                    console.log(msg);
                }); //set event listener for logging.
                ToggleMode.event.on('success', onSuccess);
                ToggleMode.event.on('fail', onFail);
                if (targetState === 'identify') {
                    ToggleMode.IdentifySwitchmate();
                } else {
                    (targetState === 'on') ? ToggleMode.TurnOn(): ToggleMode.TurnOff();
                }
            }

            function onSuccess() {
                return res.send("");
                console.log('Success!');
                //    process.exit();
            }

            function onFail() {
                console.log('Failed!');
                process.exit();
            }
        }
    })
}

module.exports = appRouter;
