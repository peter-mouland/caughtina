var bcrypt = require('bcrypt'),
    events= require('events'),
    UM = function(DBM){
        this.db = DBM;
    };

UM.prototype = new events.EventEmitter;
module.exports = UM;

// log in + log out //
UM.prototype.login = function(username, password, callback)
{   var self = this;
    self.db['User'].findOne({username:username}, function(e, user) {
        if (user == null){
            callback('user-not-found');
        }	else{
            bcrypt.compare(password, user.password, function(err, res) {
                if (res){
                    callback(null, user);
                }	else{
                    callback('invalid-password');
                }
            });
        }
    });
};
//todo: logout

// checking user details //
UM.prototype.getUser = function(req){
    return (req.session && req.session.user != null) ? req.session.user : undefined;
};

//sign up + update details //
UM.prototype.signup = function(newData, callback){
    var self = this;
    self.db['User'].findOne({username:newData.username}, function(e, user) {
        if (user){
            callback('username-taken');
        }	else{
            self.db['User'].findOne({email:newData.email}, function(e, user) {
                if (user){
                    callback('email-taken');
                }	else{
                    self.saltAndHash(newData.password, function(hash){
                        newData.password = hash;
                        self.db['User'].create(newData, function (err, user) {
                            if (err) return handleError(err);
                            callback(null, user);
                        });
                    });
                }
            });
        }
    });
};
//todo:update details


// utils //
UM.prototype.saltAndHash = function(pass, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(pass, salt, function(err, hash) {
            callback(hash);
        });
    });
};