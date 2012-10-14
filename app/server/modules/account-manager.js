var bcrypt = require('bcrypt'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    moment = require('moment'),
    events= require('events'),
    AM = function(opts){
        var self = this;
        self.db = new Db(opts.dbName, new Server(opts.dbHost, opts.dbPort, {auto_reconnect: true}, {}));
        self.db.open(function(e, d){
            if (e) {
                console.log(e);
            }	else{
                console.log('connected to database :: ' + opts.dbName);
                self.accounts = self.db.collection('accounts');
            }
        });

    };

AM.prototype = new events.EventEmitter;
module.exports = AM;

//checking user details//
AM.prototype.getUser = function(req){
    return (req.session && req.session.user != null) ? req.session.user : undefined;
};
AM.prototype.isAdminUser = function(user){
    return (user!=null && user.email=='peter.mouland@gmail.com')
};

// logging in //
AM.prototype.autoLogin = function(user, pass)
{   var self = this;
    self.accounts.findOne({user:user}, function(e, o) {
        if (o){
            o.pass == pass ? self.emit('autoLogin.success', o) : self.emit('autoLogin.fail');
        }	else{
            self.emit('autoLogin.fail');
        }
    });
};

AM.prototype.manualLogin = function(user, pass, callback)
{   var self = this;
    self.accounts.findOne({user:user}, function(e, o) {
        if (o == null){
            callback('user-not-found');
        }	else{
            bcrypt.compare(pass, o.pass, function(err, res) {
                if (res){
                    callback(null, o);
                }	else{
                    callback('invalid-password');
                }
            });
        }
    });
};

// record insertion, update & deletion methods //

AM.prototype.signup = function(newData, callback)
{   var self = this;
    self.accounts.findOne({user:newData.user}, function(e, o) {
        if (o){
            callback('username-taken');
        }	else{
            self.accounts.findOne({email:newData.email}, function(e, o) {
                if (o){
                    callback('email-taken');
                }	else{
                    self.saltAndHash(newData.pass, function(hash){
                        newData.pass = hash;
                        // append date stamp when record was created //
                        newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        self.accounts.insert(newData, callback(null));
                    });
                }
            });
        }
    });
};

AM.prototype.update = function(newData, callback)
{
    AM.accounts.findOne({user:newData.user}, function(e, o){
        o.name 		= newData.name;
        o.email 	= newData.email;
        o.country 	= newData.country;
        if (newData.pass == ''){
            AM.accounts.save(o); callback(o);
        }	else{
            AM.saltAndHash(newData.pass, function(hash){
                o.pass = hash;
                AM.accounts.save(o); callback(o);
            });
        }
    });
};

AM.prototype.setPassword = function(email, newPass, callback)
{
    AM.accounts.findOne({email:email}, function(e, o){
        AM.saltAndHash(newPass, function(hash){
            o.pass = hash;
            AM.accounts.save(o); callback(o);
        });
    });
};

AM.prototype.validateLink = function(email, passHash, callback)
{
    AM.accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
        callback(o ? 'ok' : null);
    });
};

AM.prototype.saltAndHash = function(pass, callback)
{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(pass, salt, function(err, hash) {
            callback(hash);
        });
    });
};

AM.prototype.delete = function(id, callback)
{
    AM.accounts.remove({_id: this.getObjectId(id)}, callback);
};

// auxiliary methods //

AM.prototype.getEmail = function(email, callback)
{
    AM.accounts.findOne({email:email}, function(e, o){ callback(o); });
};

AM.prototype.getObjectId = function(id)
{
    return AM.accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

AM.prototype.getAllRecords = function(callback)
{
    AM.accounts.find().toArray(
        function(e, res) {
            if (e) callback(e)
            else callback(null, res)
        });
};

AM.prototype.delAllRecords = function(id, callback)
{
    AM.accounts.remove(); // reset accounts collection for testing //
}

// just for testing - these are not actually being used //

AM.prototype.findById = function(id, callback)
{
    AM.accounts.findOne({_id: this.getObjectId(id)},
        function(e, res) {
            if (e) callback(e)
            else callback(null, res)
        });
};


AM.prototype.findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
    AM.accounts.find( { $or : a } ).toArray(
        function(e, results) {
            if (e) callback(e)
            else callback(null, results)
        });
};