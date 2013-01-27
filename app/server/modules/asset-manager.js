var FILE_ENCODING = 'utf-8',
    nib = require('nib'),
    uglyfyJS = require('uglify-js'),
    stylus = require('stylus'),
    fs = require('fs'),
    AM = function(path,files){
        this.path = path;
        this.files = files;
    };

module.exports = AM;

AM.prototype.concatFiles = function() {
    var self = this,
        out = self.files.map(function(filePath){
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
        return stylus(str)
            .set('filename', path)
            .set('compress', true)
            .use(nib());
};

AM.prototype.uglify = function () {
        var self = this,
            srcPath = this.concatFiles(),
            jsp = uglyfyJS.parser,
            pro = uglyfyJS.uglify,
            ast = jsp.parse( fs.readFileSync(srcPath, FILE_ENCODING) );

        ast = pro.ast_mangle(ast);
        ast = pro.ast_squeeze(ast);

        fs.writeFileSync(self.path, pro.gen_code(ast), FILE_ENCODING);
        console.log('uglify: '+ self.path +' built.');
        return self.path;
};
