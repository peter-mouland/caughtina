var fs = require('fs'),
    mongoose = require('mongoose'),
    DBM = function(){
        mongoose.connect(global.dburi);
        var self = this,
            db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback () {
            self.createUserSchema();
            self.createPageSchema();
        });
    };

module.exports = DBM;

DBM.prototype.init = function(){
    if (this.db['Page'].find().length()>0){ return ; }
    this.pukePages();
};

// schemas //
DBM.prototype.createPageSchema = function(){
    var pageSchema = new mongoose.Schema({
            pageType: {type: String},
            url: { type : String, index: { unique: true }},
            title: String,
            subtitle: String,
            isDraft: {type:Boolean, default:true},
            published: Date,
            updated: Date,
            author: String,
            summary: String,
            body: String,
            tags: Array
        }),
        Page;
    Page = mongoose.model('Page', pageSchema);
    this['Page'] = Page;
};

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

DBM.prototype.pukePages = function(){
    var self = this,
        aboutJson = eval(fs.readFileSync('app/server/json/about.json')+'')[0],
        indexJson = eval(fs.readFileSync('app/server/json/index.json')+'')[0],
        adminJson = eval(fs.readFileSync('app/server/json/admin.json')+'')[0],
        postsJson = eval(fs.readFileSync('app/server/json/posts.json')+'');

        self['Page'].create(aboutJson,indexJson, adminJson, function (err) {  if (err) {console.log('error',err);} });
        self['Page'].create(postsJson, function (err) {  if (err) {console.log('error',err);} });
}