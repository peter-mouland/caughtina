var asset_manager = require('./server/modules/asset-manager');

var js_manager = new asset_manager('/js/app.js', [  'app/public/js/lib/jquery-1.8.2.min.js',
                                                    'app/public/js/lib/jquery.cookie.js',
                                                    'app/public/js/lib/jquery.sortable.js',
                                                    'app/public/js/ciadc.js']);
var css_manager = new asset_manager();

module.exports = function(app, exp) {

    app.configure(function(){

        app.configure('development',function(){
            app.use(exp.static(app.root + '/public'));
            app.use(exp.errorHandler({ dumpExceptions: true, showStack: true }));
            js_manager.concatFiles();
            global.dburi = "mongodb://localhost/ciadc"
        });

        app.configure('production', function(){
            var oneYear = 31557600000;
            app.use(exp.static(app.root + '/public', { maxAge: oneYear }));
            app.use(exp.errorHandler());
            js_manager.uglify();
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
        app.use(exp.static(app.root + '/app/server'));
        app.use(exp.static(app.root + '/app/public'));
        app.use(css_manager.stylus(app.root + '/app/public'));
        app.use(exp.favicon(app.root + '/app/public/favicon.ico', {maxAge: 86400000}));
    });

}


