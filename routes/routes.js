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
        var cmd = '/home/pi/polly/announceList.sh /home/pi/for-reals.txt';

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
            var args = ['foo', 'bar', 'fbd7e6af7963', queryAsObject.onoff, 'WvKK0A=='];
  	    var exec = require('child_process').exec;
	    var cmd = '/home/pi/polly/flip-switch.sh ' + queryAsObject.onoff;
	    var output = "";
	    exec(cmd, function(error, stdout, stderr) {output = error + stdout + stderr});
            return res.send("switchmate called: " + output);
        }
    })
}

module.exports = appRouter;
