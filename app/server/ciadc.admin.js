var data = {
        admin_users:false
    };

module.exports = {
    admin_users: function(){
        if (!this._admin_users){
            this._admin_users = data['admin_users'];
        }
        return this._admin_users;
    }
};