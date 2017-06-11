'use strict';
const request = require('superagent');
module.exports = function witClient(token) {

    const ask = function (message,callback) {
        console.log("Called");
        request.get('https://api.wit.ai/message').set('Authorization', 'Bearer ' + token)
            .query({
                v: '16/05/2017'
            })
            .query({
                q: message
            })
            .end((err, res) => {
                const timeIntent = require('./intents/intent');
                timeIntent.process(res.body.entities,(err)=>{
                    if(err){
                        return callback(err);
                    }else{
                        return callback(null,res.body.entities);
                    }
                });
            });
        console.log('ASKED :' + message);
        console.log('TOKEN :' + token);
    }
    return {
        ask: ask
    }
}
