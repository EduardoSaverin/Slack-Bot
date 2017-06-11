'use strict';

module.exports.process = function(data,callback){
    console.log(data);
    if(data.intent[0].value.toLowerCase().trim() !== 'time'){
        return callback(new Error('No time intent provided.'));
    }
    if(!data.location){
        return callback(new Error('No location provided.'));
    }
    return callback(false);
};