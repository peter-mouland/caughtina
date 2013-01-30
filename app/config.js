var asset_manager = require('./server/modules/asset-manager'),
stylus = require('stylus'),
    nib = require('nib');

module.exports = function(app, exp) {

    var js_manager = new asset_manager(app.public + '/js/app.js',
        [   app.public + '/js/lib/jquery-2.0.0b.js',
            app.public + '/js/lib/jquery.cookie.js',
            app.public + '/js/lib/json2.js',
            app.public + '/js/lib/underscore-min.js',
            app.public + '/js/lib/backbone-min.js',
            app.public + '/js/modules/utils.js',
            app.public + '/js/modules/navigation-manager.js',
            app.public + '/js/modules/offline-storage-manager.js',
            app.public + '/js/modules/page-editor.js']);
    var css_manager = new asset_manager();

    app.configure(function(){

        app.configure('development',function(){
            console.log(app.root)
            app.use(exp.static(app.root + app.public));
            app.use(exp.errorHandler({ dumpExceptions: true, showStack: true }));
            js_manager.concatFiles();
            global.dburi = "mongodb://localhost/ciadc"
        });

        app.configure('production', function(){
            var oneYear = 31557600000;
            app.use(exp.static(app.root + app.public, { maxAge: oneYear }));
            app.use(exp.errorHandler());
            js_manager.uglify();
            global.dburi = process.env.MONGOLAB_URI
        });

        app.set('views', app.root + 'app/server/views');
        app.set('view engine', 'jade');
        app.set('view options', { doctype : 'html', pretty : true });
        app.use(exp.bodyParser());
        app.use(exp.cookieParser());
        app.use(exp.session({ secret: 'super-duper-secret-secret' }));
        app.use(app.router);
        app.use(exp.logger('dev'));
        app.use(exp.methodOverride());
        app.use(css_manager.stylus({ src: __dirname + '/server/assets',dest: __dirname + '/public'}));
        app.use(exp.favicon(app.root + app.public + '/favicon.ico', {maxAge: 86400000}));
    });

};