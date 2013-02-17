var FILE_ENCODING = 'utf-8',
    uglyfyJS = require('uglify-js'),
    stylus = require('stylus'),
    fs = require('fs'),
    AM = function(path,files){
        this.path = path;
        this.files = files;
    };

module.exports = AM;

AM.prototype.concatFiles = function() {
    console.log('building file with:');
    var self = this,
        out = self.files.map(function(filePath){
            console.log('   ' + filePath);
            return fs.readFileSync(filePath, FILE_ENCODING);
        });
    fs.writeFileSync(self.path, out.join('\n'), FILE_ENCODING);
    console.log('concat: '+ self.path +' built.');
    return self.path;
};

AM.prototype.stylus = function(config){
    config.compile = this.compile
    return stylus.middleware(config)
};

AM.prototype.compile = function(str, path) {
    console.log('compiled css')
        return stylus(str)
            .set('filename', path)
            .set('compress', true);
};

AM.prototype.uglify = function () {
        var result = uglyfyJS.minify(this.files);
        fs.writeFileSync(this.path, result.code, FILE_ENCODING);
        return this.path;
};
