var OSM = function(dbName){
    this.db = openDatabase(dbName, "1.0", dbName, 200000);

    this.dataset = {};
//    navigator.onLine
};

OSM.prototype.onError = function(tx, error) {
    alert(error.message);
};


OSM.prototype.create_table = function(){
    var self = this,
        createStatement = "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, commit_sent INT, commit_saved INT, name TEXT, content TEXT, change_saved DATE)";
    self.db.transaction(function(tx) {
        tx.executeSql(createStatement, [], self.showRecords, self.onError);
    });

};

OSM.prototype.showRecords = function() {
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

OSM.prototype.loadRecord = function(i) {
    var item = dataset.item(i);
    firstName.value = item['firstName'];
    lastName.value = item['lastName'];
    phone.value = item['phone'];
    id.value = item['id'];
};

OSM.prototype.update = function(){
    var self = this,
        updateStatement = "UPDATE Contacts SET firstName = ?, lastName = ?, phone = ? WHERE id = ?";
    self.db.transaction(function(tx) {
        tx.executeSql(updateStatement, [firstName.value, lastName.value, phone.value, id.value], self.loadAndReset, self.onError);
    });
};


OSM.prototype.insert = function(){
    var self = this,
        insertStatement = "INSERT INTO Contacts (firstName, lastName, phone) VALUES (?, ?, ?)";
    self.db.transaction(function(tx) {
        tx.executeSql(insertStatement, [firstName.value, lastName.value, phone.value], self.loadAndReset, self.onError);
    });

};

OSM.prototype.delete = function(){
    var self = this,
        deleteStatement = "DELETE FROM Contacts WHERE id=?";
    self.db.transaction(function(tx) {
        tx.executeSql(deleteStatement, [id], self.showRecords, self.onError);
    });
    self.resetForm();
};

OSM.prototype.drop = function(){
    var self = this,
        dropStatement = "DROP TABLE Contacts";
    self.db.transaction(function(tx) {
        tx.executeSql(dropStatement, [], self.showRecords, self.onError);
    });
    self.resetForm();
};

OSM.prototype.loadAndReset = function(){
    self.resetForm();
    self.showRecords();
};

OSM.prototype.resetForm = function(){
    firstName.value = '';
    lastName.value = '';
    phone.value = '';
    id.value = '';
};

//window.onload = function () {
//    writeroot = document.getElementById('writeroot');
//    addEventSimple(window,'online',test);
//    addEventSimple(window,'offline',test);
//    test();
//}

function addEventSimple(obj,evt,fn) {
    if (obj.addEventListener)
        obj.addEventListener(evt,fn,false);
    else if (obj.attachEvent)
        obj.attachEvent('on'+evt,fn);
}

function removeEventSimple(obj,evt,fn) {
    if (obj.removeEventListener)
        obj.removeEventListener(evt,fn,false);
    else if (obj.detachEvent)
        obj.detachEvent('on'+evt,fn);
}