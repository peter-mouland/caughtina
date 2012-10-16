var stylus = require('stylus'),
    nib = require('nib'),
    uglyfyJS = require('uglify-js'),
    fs = require('fs');

module.exports = function(app, exp) {

    app.configure(function(){
        var FILE_ENCODING = 'utf-8',
            JS_FILE_PATH = '/js/app.js',
            JS_FILE_LIST = ['app/public/js/lib/jquery-1.8.2.min.js',
                'app/public/js/lib/jquery.cookie.js',
                'app/public/js/lib/jquery.sortable.js',
                'app/public/js/ciadc.js'],
            compile = function(str, path) {
                return stylus(str)
                    .set('filename', path)
                    .set('compress', true)
                    .use(nib());
            },
            concat = function(fileList, distPath) {
                var out = fileList.map(function(filePath){
                    return fs.readFileSync( filePath, FILE_ENCODING);
                });
                fs.writeFileSync('app/public/' + distPath, out.join('\n'), FILE_ENCODING);
                console.log('concat: '+ distPath +' built.');
                return distPath;
            },
            uglify = function (fileList, distPath) {
                var srcPath = concat(fileList, distPath),
                    jsp = uglyfyJS.parser,
                    pro = uglyfyJS.uglify,
                    ast = jsp.parse( fs.readFileSync(srcPath, FILE_ENCODING) );

                ast = pro.ast_mangle(ast);
                ast = pro.ast_squeeze(ast);

                fs.writeFileSync(distPath, pro.gen_code(ast), FILE_ENCODING);
                console.log('uglify: '+ distPath +' built.');
                return distPath;
            };


        app.configure('development',function(){
            app.use(exp.static(app.root + '/public'));
            app.use(exp.errorHandler({ dumpExceptions: true, showStack: true }));
            concat(JS_FILE_LIST,JS_FILE_PATH);
            global.host = 'localhost'
            global.dburi = "mongodb://localhost/ciadc"
        });

        app.configure('production', function(){
            var oneYear = 31557600000;
            app.use(exp.static(app.root + '/public', { maxAge: oneYear }));
            app.use(exp.errorHandler());
            concat(JS_FILE_LIST,JS_FILE_PATH);//uglify
            global.host = 'www.caughtina.com'
            global.dburi = process.env.MONGOLAB_URI
        });

        app.set('views', app.root + '/app/server/views');
        app.set('view engine', 'jade');
        app.set('view options', { doctype : 'html', pretty : true });
        app.use(exp.bodyParser());
        app.use(exp.cookieParser());
        app.use(exp.session({ secret: 'super-duper-secret-secret' }));
        app.use(app.router);
        app.use(exp.logger('dev'));
        app.use(exp.methodOverride());
        app.use(require('stylus').middleware({ src: app.root + '/app/public' }));
        app.use(exp.static(app.root + '/app/server'));
        app.use(exp.static(app.root + '/app/public'));
        app.use(stylus.middleware({ src: app.root + '/app/public', compile: compile}));
        app.use(exp.favicon(app.root + '/app/public/favicon.ico', {maxAge: 86400000}));
    });

}


