'use strict';
var express = require('express');
var app = express();
var request = require('superagent');
var GEO_CODING_API = 'YOUR_GOOGLE_GEO_CODING_API_KEY';
var TIMEZONE_API = 'YOUR_GOOGLE_TIMEZONE_API_KEY';
const moment = require('moment');

app.get('/service/:location', (req, res, next) => {
    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=' + GEO_CODING_API)
        .end((error, response) => {
            if (error) {
                console.log(err);
                return res.sendStatus(500);
            }
            //Location contains two things "lat" & "lng";
            const location = response.body.results[0].geometry.location;
            // Getting Unix timestamp milliseconds
            // lowercase 'x' gives time in milliseconds while capital 'X' gives time in seconds.
            const timestamp = +moment().format('X');
            console.log('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp+ '&key=' + TIMEZONE_API);
            request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + TIMEZONE_API)
                .end((error, response) => {
                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }
                    const result = response.body;
                    //Getting as Unix timestamp
                    const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd DD MMM YY h:mm:ss a');
                    res.json({result:timeString});
                });
        });
});

module.exports.service = app;
