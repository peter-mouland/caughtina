var fs = require('fs'),
    zipstream = require('zipstream'),
    moment = require('moment'),
    PM = function(db){
        this.metaColumns = 'title subtitle published updated summary author tags url';
        this.bodyColumns = 'body';
        this.db = db;
        this.items_per_page = 5;
    };

module.exports = PM;

//PM.prototype.archive_directory = function(root, dir, callback){
//    fs.readdir(root + '/' + dir + '/', function(err, files){
//        if (files.length<1){ return; }
//        var out = fs.createWriteStream(root + '/archive-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.zip'),
//            zip = zipstream.createZip({ level: 1 }),
//            fn = "zip.finalize(function(written) { console.log(written + ' total bytes written');});",
//            execute = "",
//            filename = "",
//            final = "",
//            len= files.length,
//            f= 0;
//        zip.pipe(out);
//
//        for (f; f<len; f++){
//            filename = files[f];
//            execute +="zip.addFile(fs.createReadStream('" + root + '/' + dir + '/' + filename + "'),{name:'" + filename + "'},function(){";
//            fn += " fs.unlink('" + root + '/' + dir + '/' + filename + "',function(err){if (err) console.log(err);});";
//            if (f==len-1){
//                execute += fn;
//            }
//            final += "});";
//        }
//        execute += final;
//        eval(execute);
//        callback();
//    });
//}

//PM.prototype.update_file = function(req, file, callback){
//    var oldFile = 'app/server/admin/updates/' + file + '.html',
//        newFile = 'app/server/admin/archive/' + file + '-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.html';
//
//    var data = '';
//    req.addListener('data', function(chunk) { data += chunk; });
//    req.addListener('end', function(){
//        fs.readFile(oldFile, 'utf8', function (err, originalData) {
//            if (err) {   return console.log(err);        }
//            fs.writeFile(newFile, originalData, function (err) {
//                if (err) {  return console.log(err); }
//                console.log(oldFile + ' copied to ' + newFile);
//                fs.writeFile(oldFile, data, function (err) {
//                    if (err) { return console.log(err);}
//                    console.log(oldFile + ' updated.');
//                    callback();
//
//                });
//            });
//        });
//    });
//};

//PM.prototype.delete_files = function(root, dir, callback){
//    var execCallback = function(count){
//        if (typeof callback == 'function'){
//            callback(count);
//            return;
//        }
//    };
//    fs.readdir(root + '/' + dir + '/', function(err, files){
//        if (files.length<1){ return execCallback(0); }
//        var file,
//            len= files.length,
//            f= 0;
//        for (f; f<len; f++){
//            file = root + '/' + dir + '/' + files[f];
//            fs.unlink(file, function (err) {
//                if (err) throw err;
//                console.log('successfully deleted ' + file);
//            });
//        }
//        execCallback(len);
//    });
//};


//PM.prototype.get_previous = function(type, current, callback){
//    this.published(type, function(published){
//        callback(thisPage[published.indexOf(current)+1]);
//    });
//};
//
//PM.prototype.get_next = function(type, current, callback){
//    this.published(type, function(published){
//        callback(thisPage[published.indexOf(current)-1]);
//    });
//};
//
//
//PM.prototype.published = function(type, callback){
//    var self = this;
//    if (!this._published) { this._published = {}; }
//    if (this._published[type]){  return this._published[type];     }
//    this.db['Page'].find({pageType:type}).where('isDraft',false).exec(function(err,pub){
//        self._published[type] = pub;
//        callback(pub);
//    });
//};

PM.prototype.pretty_date = function(date, format){
    format = format || 'Do MMMM YYYY';
    return moment(date).format(format);
};

PM.prototype.stringToId = function(s){
    return s.toLowerCase().replace(/ /g,'-');
};

PM.prototype.paged = function(type,page_number, callback){
    if (!this._paged) {                  this._paged = {};                      }
    if (!this._paged[type]){             this._paged[type] = {};                }
    if (this._paged[type][page_number]){ return callback(this._paged[type][page_number]); }
    var self = this,
        published = this.db['Page'].find({pageType:type}).where('isDraft',false);

    published.limit(this.items_per_page)
        .skip(this.items_per_page * (page_number-1))
        .select(this.metaColumns)
        .sort({published: 'desc'}).exec(function(err,pages){
            published.count().exec(function (err, count) {
                var _return = {
                    items: pages,
                    page_number: page_number,
                    count: Math.ceil(count / self.items_per_page)
                };
                self._paged[type][page_number] = _return;
                callback(_return);
            });
        });
    return null;
};

PM.prototype.metadata = function(type, url, callback) {
    var self = this;
    if (!this._metadata){                this._metadata = {};              }
    if (!this._metadata[type]){          this._metadata[type] = {};        }
    if (this._metadata[type][url]){      return callback(this._metadata[type][url]); }
    if (!url) {url='';}

    this.db['Page'].findOne({pageType:type, url:url}).select(this.metaColumns).exec(function(err, page){
        if (err) return callback({pageType: 500,url:'/500',title:'Internal Server Error',subtitle:'Sorry!'});
        if (!page) return callback({pageType: 404,url:'/404',title:'Page Not Found',subtitle:'Sorry!'});
        self._metadata[type][url] = page;
        callback(page);
    });
};

PM.prototype.alldata = function(type, url, callback) {
    var self = this;
    if (!this._alldata){                this._alldata = {};              }
    if (!this._alldata[type]){          this._alldata[type] = {};        }
    if (this._alldata[type][url]){      return callback(this._alldata[type][url]); }
    if (!url) {url='';}

    this.db['Page'].findOne({pageType:type, url:url}).select(this.metaColumns + ' '+ this.bodyColumns).exec(function(err, page){
        if (err) return callback({pageType: 500,url:'/500',title:'Internal Server Error',subtitle:'Sorry!'});
        if (!page) return callback({pageType: 404,url:'/404',title:'Page Not Found',subtitle:'Sorry!'});
        self._alldata[type][url] = page;
        callback(page);
    });
};