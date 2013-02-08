var offline_storage = function(dbName){
    this.db = openDatabase(dbName, "1.0", dbName, 200000);
    this.dataset = {};
};



offline_storage.prototype.onError = function(tx, error) {
    console.log(tx,error.message);
};


offline_storage.prototype.create_table = function(tbName){
    var self = this,
        createStatement = "CREATE TABLE IF NOT EXISTS " + tbName + " (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, commit_sent INT DEFAULT 0, commit_saved INT DEFAULT 0, name TEXT, content TEXT, change_saved DATETIME DEFAULT CURRENT_TIMESTAMP)";
    self.db.transaction(function(tx) {
        tx.executeSql(createStatement, [], function(){self.showRecords(tbName);}, self.onError);
    });

};

offline_storage.prototype.showRecords = function(tbName, callback) {
    var self = this,
        selectAllStatement = "SELECT * FROM " + tbName + " where commit_saved=0";
//    results.innerHTML = '';
    self.db.transaction(function(tx) {
        tx.executeSql(selectAllStatement, [], function(tx, result) {
            self.dataset = result.rows;
            if (callback) callback(self.dataset)
//            for (var i = 0, item = null; i < dataset.length; i++) {
//                item = dataset.item(i);
//                results.innerHTML +=
//                '<li>' + item['lastName'] + ' , ' + item['firstName'] + ' <a href="#" onclick="loadRecord('+i+')">edit</a>  ' +
//                '<a href="#" onclick="deleteRecord('+item['id']+')">delete</a></li>';
//            }
        });
    });
};

offline_storage.prototype.loadRecord = function(i) {
    var item = this.dataset.item(i);
//    firstName.value = item['user'];
//    lastName.value = item['content'];
//    phone.value = item['phone'];
//    id.value = item['id'];
    return item;
};

offline_storage.prototype.update = function(tbName){
    var self = this,
        updateStatement = "UPDATE " + tbName + " SET firstName = ?, lastName = ?, phone = ? WHERE id = ?";
    self.db.transaction(function(tx) {
        tx.executeSql(updateStatement, [firstName.value, lastName.value, phone.value, id.value], function(){self.loadAndReset()}, self.onError);
    });
};


offline_storage.prototype.insert = function(tbName, content){
    var self = this,
        insertStatement = "INSERT INTO " + tbName + " (user, name, content) VALUES (?, ?, ?)";
    self.db.transaction(function(tx) {
        tx.executeSql(insertStatement, ['', '', content], function(){self.loadAndReset()}, self.onError);
    });

};

offline_storage.prototype.delete = function(tbName){
    var self = this,
        deleteStatement = "DELETE FROM " + tbName + " WHERE id=?";
    self.db.transaction(function(tx) {
        tx.executeSql(deleteStatement, [id], function(){self.showRecords(tbName);}, self.onError);
    });
    self.resetForm();
};

offline_storage.prototype.drop = function(tbName){
    var self = this,
        dropStatement = "DROP TABLE " + tbName + "";
    self.db.transaction(function(tx) {
        tx.executeSql(dropStatement, [], function(){self.showRecords(tbName);}, self.onError);
    });
    self.resetForm();
};

offline_storage.prototype.loadAndReset = function(){
    this.resetForm();
    this.showRecords();
};

offline_storage.prototype.resetForm = function(){
//    firstName.value = '';
//    lastName.value = '';
//    phone.val///ue = '';
//    id.value = '';
};

var OS;
if (typeof openDatabase!='undefined') {
    OS = new offline_storage('posts');
} else {
    OS = {
        showRecords: function(){}
    }
}

//var cache = window.applicationCache;
//
//cache.addEventListener("cached", function () {
//    console.log("All resources for this web app have now been downloaded. You can run this application while not connected to the internet");
//}, false);
//cache.addEventListener("checking", function () {
//    console.log("Checking manifest");
//}, false);
//cache.addEventListener("downloading", function () {
//    console.log("Starting download of cached files");
//}, false);
//cache.addEventListener("error", function (e) {
//    console.log("There was an error in the manifest, downloading cached files or you're offline: " + e);
//}, false);
//cache.addEventListener("noupdate", function () {
//    console.log("There was no update needed");
//}, false);
//cache.addEventListener("progress", function () {
//    console.log("Downloading cached files");
//}, false);
//cache.addEventListener("updateready", function () {
//    cache.swapCache();
//    console.log("Updated cache is ready");
//    Even after swapping the cache the currently loaded page won't use it
//    until it is reloaded, so force a reload so it is current.
//    window.location.reload(true);
//    console.log("Window reloaded");
//}, false);