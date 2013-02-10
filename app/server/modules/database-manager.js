var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    events= require('events'),
    DBM = function(){
        mongoose.connect(global.dburi);
        var self = this,
            db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback () {
            self.createUserSchema();
        });
    };

DBM.prototype = new events.EventEmitter;
module.exports = DBM;

// schemas //
DBM.prototype.createUserSchema = function(){
    var userSchema = new mongoose.Schema({
            admin: Boolean,
            name: String,
            email: { type : String, index: { unique: true }},
            password: String,
            username: { type : String, index: { unique: true }},
            created: {type: Date, default: Date.now}
        }),
        User;

    User = mongoose.model('User', userSchema);
    this['User'] = User;
};

// log in + log out //
DBM.prototype.login = function(username, password, callback)
{   var self = this;
    self['User'].findOne({username:username}, function(e, user) {
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
DBM.prototype.getUser = function(req){
    return (req.session && req.session.user != null) ? req.session.user : undefined;
};
DBM.prototype.isAdminUser = function(user){
    return (user!=null && user.admin===true);
};

//sign up + update details //
DBM.prototype.signup = function(newData, callback){
    var self = this;
    self['User'].findOne({username:newData.username}, function(e, user) {
        if (user){
            callback('username-taken');
        }	else{
            self['User'].findOne({email:newData.email}, function(e, user) {
                if (user){
                    callback('email-taken');
                }	else{
                    self.saltAndHash(newData.password, function(hash){
                        newData.password = hash;
                        self['User'].create(newData, function (err, user) {
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
DBM.prototype.saltAndHash = function(pass, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(pass, salt, function(err, hash) {
            callback(hash);
        });
    });
};