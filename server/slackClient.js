var RtmClient = require('@slack/client').RtmClient;

var bot_token = 'YOUR_SLACK_BOT_TOKEN';

var rtm = new RtmClient(bot_token);

module.exports.getSlackClient = function () {
    return rtm;
}
