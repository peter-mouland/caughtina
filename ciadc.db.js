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
    },
    get_user: function(user, type){
        if (!type) type = 'casual';
        db.collection('users', function(err, collection) {
            if(err) { console.log(err); }
            collection.findOne({type:'optimus'}, function(err, user) {
                return user;
            });
        });

    },
    show_set_user_dialog: function(){

    }
};
