var fs = require('fs'),
    zipstream = require('zipstream'),
    moment = require('moment'),
    PM = function(){
        this.data = {
            posts: eval(fs.readFileSync('app/server/json/posts.json')+'').sort(function(a,b){return (b.published && a.published != b.published);}),
            index: eval(fs.readFileSync('app/server/json/index.json')+''),
            admin: eval(fs.readFileSync('app/server/json/admin.json')+''),
            about: eval(fs.readFileSync('app/server/json/about.json')+'')
        };
        this.items_per_page = 5;
    };

module.exports = PM;

PM.prototype.archive_directory = function(root, dir, callback){
    fs.readdir(root + '/' + dir + '/', function(err, files){
        if (files.length<1){ return; }
        var out = fs.createWriteStream(root + '/archive-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.zip'),
            zip = zipstream.createZip({ level: 1 }),
            fn = "zip.finalize(function(written) { console.log(written + ' total bytes written');});",
            execute = "",
            filename = "",
            final = "",
            len= files.length, f= 0;
        zip.pipe(out);

        for (f; f<len; f++){
            filename = files[f];
            execute +="zip.addFile(fs.createReadStream('" + root + '/' + dir + '/' + filename + "'),{name:'" + filename + "'},function(){";
            fn += " fs.unlink('" + root + '/' + dir + '/' + filename + "',function(err){if (err) console.log(err);});";
            if (f==len-1){
                execute += fn;
            }
            final += "});";
        }
        execute += final;
        eval(execute);
        callback();
    });
}

PM.prototype.update_file = function(oldFile,newFile,data, res){
    fs.readFile(oldFile, 'utf8', function (err, originalData) {
        if (err) {   return console.log(err);        }
        fs.writeFile(newFile, originalData, function (err) {
            if (err) {  return console.log(err); }
            console.log(oldFile + ' copied to ' + newFile);
            fs.writeFile(oldFile, data, function (err) {
                if (err) { return console.log(err);}
                console.log(oldFile + ' updated.');
                res.writeHead(200, {'Content-Type': 'text/json'});
                res.end('{"saved":"true"}');

            });
        });
    });
};

PM.prototype.get_previous = function(type, current){
    var parent = this.published(type);
    return parent[parent.indexOf(current)+1];
};

PM.prototype.get_next = function(type, current){
    var parent = this.published(type);
    return parent[parent.indexOf(current)-1];
};

PM.prototype.pretty_date = function(date, format){
    format = format || 'Do MMMM YYYY';
    return moment(date).format(format);
};

PM.prototype.published = function(type){
    if (this._published && this._published[type]){  return this._published[type];     }
    this._published = {};
    var i= 0,
        parent = this.data[type],
        len = parent.length,
        items = [];
    for (i;i<len;i++){
        if (parent[i].published) { items.push(parent[i]); }
    }
    this._published[type] = items;
    return items;
};

PM.prototype.paged = function(type,page_number){
    if (!this._paged) {                  this._paged = {};                      }
    if (!this._paged[type]){             this._paged[type] = {};                }
    if (this._paged[type][page_number]){ return this._paged[type][page_number]; }
    var i= 0,
        parent = this.data[type],
        len = 0,
        pages = [],
        _return;
    if (!parent){return {items:0};} //no page items so you leave with nothing.

    len = (parent.length>this.items_per_page)? this.items_per_page : parent.length;
    if (page_number){
        i=((page_number-1)*(len));
        len=i+len;
    } else {
        page_number = 1;
    }
    for (i;i<len;i++){
        if (parent[i].published) { pages.push(parent[i]); }
    }
    _return = {items:pages,current:page_number, count:(Math.ceil(this.published(type).length/this.items_per_page))};
    this._paged[type][page_number] = _return;
    return _return;
};

PM.prototype.metadata = function(type,url) {
    if (!this._metadata){                this._metadata = {};              }
    if (!this._metadata[type]){          this._metadata[type] = {};        }
    if (this._metadata[type][url]){      return this._metadata[type][url]; }
    if (!url) {url='/';}
    var i= 0,
        parent = this.data[type],
        len = parent.length,
        _return;
    for (i;i<len;i++){
        if (parent[i].url == url) {
            _return = parent[i];
            this._metadata[type][url] = _return;
            return _return;
        }
    }
    return false;
};