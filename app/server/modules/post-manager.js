var events= require('events'),
    PM = function(DBM){
        this.db = DBM;
    };

PM.prototype = new events.EventEmitter;
module.exports = PM;