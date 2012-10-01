//$ cd DevRoot/heroku/caughtina/
//$ git push heroku-caughtina
//todo: gzip static assets
//todo: improve cache busting of assets for new builds
//todo: write path to download all page versions and delete on server
//todo: write updates to deal with multiple users
//todo: add cookie check for edit url
//todo: write full page html generator
//todo: use local storgae to save document updates when offline

var express = require('express'),
    app = express.createServer(),
    jade = require('jade'),
    stylus = require('stylus'),
    zipstream = require('zipstream'),
    nib = require('nib'),
    uglyfyJS = require('uglify-js'),
    fs = require('fs'),
    moment = require('moment'),
    FILE_ENCODING = 'utf-8',
    JS_FILE_PATH = '/js/app.js',
    JS_FILE_LIST = ['public/js/lib/jquery-1.8.2.min.js',
                    'public/js/lib/jquery.cookie.js',
                    'public/js/ciadc.js'],
    ciadc = require('./ciadc.js'),
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
        fs.writeFileSync('public/' + distPath, out.join('\n'), FILE_ENCODING);
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

app.use(express.cookieParser());
app.use(app.router);
app.use(express.logger('dev'));
app.use(stylus.middleware({ src: __dirname + '/public', compile: compile}));
app.use(express.favicon(__dirname + '/public/favicon.ico', {maxAge: 86400000}));


app.configure('development',function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    concat(JS_FILE_LIST,JS_FILE_PATH);
});

app.configure('production', function(){
    var oneYear = 31557600000;
    app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
    app.use(express.errorHandler());
    concat(JS_FILE_LIST,JS_FILE_PATH);//uglify
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
    var index = ciadc.utils.metadata('index');
    res.render('index',{post:index, moment:moment, ciadc:ciadc.utils, this_page:1, editable:false});
});

app.get('/page/:page', function(req, res){
    var index = ciadc.utils.metadata('index');
    res.render('index',{post:index, moment:moment, ciadc:ciadc.utils, this_page: req.params.page, editable:false});
});

app.get('/about', function(req, res){
    res.render('about/caught-in-a-dot-com', {post:{title : "about caught in a dot com"}, editable:false});
});

app.get('/posts/:post', function(req, res){
    var post = ciadc.utils.metadata('posts',req.params.post),
        url = (post) ? req.params.post : 'holding-page';
    res.render('posts/' + url + '.jade',{post : post, moment:moment, ciadc:ciadc.utils, editable:false, key:false});
});

app.get('/posts/:post/edit', function(req, res){
    var admin = ciadc.admin_users();
    if (admin[req.cookies.uid] !== req.cookies.pass){
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('not found');
    } else {
        var post = ciadc.utils.metadata('posts',req.params.post),
            url = (post) ? req.params.post : 'holding-page';
        res.render('posts/' + url + '.jade',{post : post, moment:moment, ciadc:ciadc.utils, editable:true, key:Math.random()*10000000000000000});
    }
});

app.get('/tags/:tag', function(req, res){
    res.render('tags/holding-page.jade', {post:{title : "Tag Search"}, editable:false});
});


app.post('/update/:file', function(req, res){
    var data = '',
        oldFile = './admin/updates/' + req.params.file + '.html',
        newFile = './admin/archive/' + req.params.file + '-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.html';
    req.addListener('data', function(chunk) { data += chunk; });
    console.log(req.cookies.juan);
//    req.addListener('end', function(){ciadc.updateFile(oldFile,newFile,data, res);});
});


app.get('/admin/archive', function(req, res){
    fs.readdir('./admin/archive/', function(err, files){
        if (files.length<1){ return; }
        var out = fs.createWriteStream('./admin/archive-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.zip'),
            zip = zipstream.createZip({ level: 1 }),
            fn = "zip.finalize(function(written) { console.log(written + ' total bytes written');});",
            execute = "",
            filename = "",
            final = "",
            len= files.length, f= 0;
        zip.pipe(out);

        for (f; f<len; f++){
            filename = files[f];
            execute +="zip.addFile(fs.createReadStream('./admin/archive/" + filename + "'),{name:'" + filename + "'},function(){";
            fn += " fs.unlink('./admin/archive/" + filename + "',function(err){if (err) console.log(err);});";
            if (f==len-1){
                execute += fn;
            }
            final += "});";
        }
        execute += final;
        eval(execute);
    });
});

app.listen(process.env.PORT || 3000);