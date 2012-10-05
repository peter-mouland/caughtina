var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    server = new Server('localhost', 27017, {auto_reconnect: true});
    db = new Db('ciadc', server);



module.exports = {
    create : function(){
        db.open(function(err, db) {
            if(!err) {
                db.collection('users', {safe:true}, function(err, collection) {
                    collection.insert({type:'optimus',username:'',password:''}, {safe:true}, function(err, result) {
                        if(err) { console.log(err); }
                    });
                });
            } else {
                console.log(err);
            }
        });
        return db;
    },
    get_user: function(user, type){
        if (!type) type = 'casual';
        var _return;
        db.collection('users', function(err, collection) {
            if(err) { console.log(err); }
            collection.findOne({type:'optimus'}, function(err, user) {
//                $.trigger('ciadc.get_user',user);
            });
        });
        console.log('get',_return)
        return _return;
    },
    update_user: function(user, type, data){
        if (!type) type = 'casual';
        var _return;
        db.collection('users', function(err, collection) {
            if(err) { console.log(err); }
            collection.update({type:'optimus'}, {$set:{username:data.username}}, {safe:true}, function(err, result) {
                collection.findOne({type:'optimus'}, function(err, user) {
                    console.log(user)
                    _return = user;
                });
            });
        });
        return _return;
    }
};
