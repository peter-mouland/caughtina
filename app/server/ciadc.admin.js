var fs = require('fs'),
    data = {
        admin_users:false,
        posts: eval(fs.readFileSync('ciadc.posts.json')+'').sort(function(a,b){return (b.published && a.published != b.published);}),
        index: eval(fs.readFileSync('ciadc.index.json')+'')
    };

module.exports = {
    admin_users: function(){
        if (!this._admin_users){
            this._admin_users = data['admin_users'];
        }
        return this._admin_users;
    }
};