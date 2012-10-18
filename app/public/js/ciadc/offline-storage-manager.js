var offline_storage = function(dbName){
    this.db = openDatabase(dbName, "1.0", dbName, 200000);

    this.dataset = {};
//    navigator.onLine
};

offline_storage.prototype.onError = function(tx, error) {
    alert(error.message);
};


offline_storage.prototype.create_table = function(){
    var self = this,
        createStatement = "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, commit_sent INT, commit_saved INT, name TEXT, content TEXT, change_saved DATE)";
    self.db.transaction(function(tx) {
        tx.executeSql(createStatement, [], self.showRecords, self.onError);
    });

};

offline_storage.prototype.showRecords = function() {
    var self = this,
        selectAllStatement = "SELECT * FROM Contacts";
    results.innerHTML = '';
    self.db.transaction(function(tx) {
        tx.executeSql(selectAllStatement, [], function(tx, result) {
            self.dataset = result.rows;
            console.log(self.dataset)
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
    var item = dataset.item(i);
    firstName.value = item['firstName'];
    lastName.value = item['lastName'];
    phone.value = item['phone'];
    id.value = item['id'];
};

offline_storage.prototype.update = function(){
    var self = this,
        updateStatement = "UPDATE Contacts SET firstName = ?, lastName = ?, phone = ? WHERE id = ?";
    self.db.transaction(function(tx) {
        tx.executeSql(updateStatement, [firstName.value, lastName.value, phone.value, id.value], self.loadAndReset, self.onError);
    });
};


offline_storage.prototype.insert = function(){
    var self = this,
        insertStatement = "INSERT INTO Contacts (firstName, lastName, phone) VALUES (?, ?, ?)";
    self.db.transaction(function(tx) {
        tx.executeSql(insertStatement, [firstName.value, lastName.value, phone.value], self.loadAndReset, self.onError);
    });

};

offline_storage.prototype.delete = function(){
    var self = this,
        deleteStatement = "DELETE FROM Contacts WHERE id=?";
    self.db.transaction(function(tx) {
        tx.executeSql(deleteStatement, [id], self.showRecords, self.onError);
    });
    self.resetForm();
};

offline_storage.prototype.drop = function(){
    var self = this,
        dropStatement = "DROP TABLE Contacts";
    self.db.transaction(function(tx) {
        tx.executeSql(dropStatement, [], self.showRecords, self.onError);
    });
    self.resetForm();
};

offline_storage.prototype.loadAndReset = function(){
    self.resetForm();
    self.showRecords();
};

offline_storage.prototype.resetForm = function(){
    firstName.value = '';
    lastName.value = '';
    phone.value = '';
    id.value = '';
};

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