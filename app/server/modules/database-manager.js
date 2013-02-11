var mongoose = require('mongoose'),
    DBM = function(){
        mongoose.connect(global.dburi);
        var self = this,
            db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback () {
            self.createUserSchema();
            self.createPostSchema();
        });
    };

module.exports = DBM;

// schemas //
DBM.prototype.createPostSchema = function(){
    var postSchema = new mongoose.Schema({
            url: { type : String, index: { unique: true }},
            title: { type : String, index: { unique: true }},
            published: { type: Date, default: Date.now },
            updated: Date,
            author: String,
            summary: String,
            body: String,
            tags: [{ name: String }]
        }),
        Post;
    Post = mongoose.model('Post', postSchema);
    this['Post'] = Post;
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