'use strict';
const serviceProvider = require('./server/service');
const slack = require('./server/slackClient');
const rtm = slack.getSlackClient();
const http = require('http');
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const witToken = 'YOUR_WIT_TOKEN';
const witClient = require('./server/witClient')(witToken);
const request = require('superagent');

const server = http.createServer(serviceProvider.service);

server.listen(process.env.PORT || 3000);

server.on('listening', function () {
    console.log(`Server listening on ${server.address().port} in ${serviceProvider.service.get('env')} mode.`);
});


// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

//Connection Handling
// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    //rtm.sendMessage("Hello!","D5A3LQ708");
});

//Message Handling
rtm.on(CLIENT_EVENTS.RTM.RAW_MESSAGE, function (data) {
});

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    witClient.ask(message.text,(err,res)=>{
        try{
            if(err) throw new Error('Something is wrong :'+err.message);
            request.get(`http://localhost:3000/service/${res.location[0].value}`).end((err,response) => {
              if(err) throw new Error('Something is wrong :'+err.message);
              //console.log(response);
              rtm.sendMessage(`Time in ${res.location[0].value} is ${response.body.result}`,message.channel);
            });

        }catch(e){
            console.log(e.message);
        }
    });
});

//Disconnect Handling
rtm.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, function (data) {
    console.log(`Trying to re-connect : ${data}`);
});

rtm.on(CLIENT_EVENTS.RTM.DISCONNECT, function (data) {
    console.log('Disconnecting...');
});

rtm.start();
