//$ cd DevRoot/heroku/caughtina/
//$ git push heroku-caughtina
//todo: gzip static assets
var express = require('express'),
    app = express.createServer(),
    jade = require('jade'),
    stylus = require('stylus'),
    nib = require('nib'),
    uglyfyJS = require('uglify-js'),
     _fs = require('fs'),
     moment = require('moment'),
    FILE_ENCODING = 'utf-8',
    JS_FILE_PATH = '/js/app.js',
    JS_FILE_LIST = ['public/js/me.js'],
    compile = function(str, path) {
        return stylus(str)
            .set('filename', path)
            .set('compress', true)
            .use(nib());
    },
    concat = function(fileList, distPath) {
        var out = fileList.map(function(filePath){
            return _fs.readFileSync( filePath, FILE_ENCODING);
        });
        _fs.writeFileSync('public/' + distPath, out.join('\n'), FILE_ENCODING);
        console.log('concat: '+ distPath +' built.');
        return distPath;
    },
    uglify = function (fileList, distPath) {
        var srcPath = concat(fileList, distPath),
            jsp = uglyfyJS.parser,
            pro = uglyfyJS.uglify,
            ast = jsp.parse( _fs.readFileSync(srcPath, FILE_ENCODING) );

        ast = pro.ast_mangle(ast);
        ast = pro.ast_squeeze(ast);

        _fs.writeFileSync(distPath, pro.gen_code(ast), FILE_ENCODING);
        console.log('uglify: '+ distPath +' built.');
        return distPath;
    };

app.use(app.router);
app.use(express.logger('dev'))
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

var ciadc = {
  urlExists: function(type,url) { //todo: improve s will get slow with lots of posts
      var i= 0,
          parent = ciadc[type]
          len = parent.length;
      for (i;i<len;i++){
          if (parent[i].url == url) { return parent[i]; }
      }
      return false;
  }
};

ciadc.posts = [
    {   url:'using-html5-in-production',
        title:'using html5 in production',
        published: '2012-07-16',
        lastUpdated: '2012-07-30',
        author: 'peter-mouland',
        dataCode: ''
    },
    {   url:'client-side-kickstart',
        title:'a client side kickstart',
        subtitle:'part 1 : introduction',
        published: '2012-08-16',
        lastUpdated: '2012-08-26',
        author: 'peter-mouland'
    },
    {   url:'client-side-kickstart-design-to-web',
        title:'a client side kickstart',
        subtitle:'part 2 : design to web',
        published: '2012-08-16',
        lastUpdated: '2012-08-26',
        author: 'peter-mouland'
    },
    {   url:'client-side-kickstart-document-flow',
        title:'a client side kickstart',
        subtitle:'part 3 : document flow',
        published: '2012-08-16',
        lastUpdated: '2012-08-26',
        author: 'peter-mouland'
    },
    {   url:'client-side-kickstart-css3',
        title:'a client side kickstart',
        subtitle:'part 4 : css3',
        published: '2012-08-16',
        lastUpdated: '2012-08-26',
        author: 'peter-mouland'
    }
];


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
    res.render('index',{post:{title : "all posts"}});
});

app.get('/about', function(req, res){
    res.render('about/caught-in-a-dot-com', {post:{title : "about caught in a dot com"}});
});

app.get('/posts/:post', function(req, res){
    var post = ciadc.urlExists('posts',req.params.post),
        url = (post) ? req.params.post : 'holding-page';
    res.render('posts/' + url + '.jade',{post : post, moment:moment});
});

app.get('/tags/:tag', function(req, res){
    res.render('tags/holding-page.jade', {post:{title : "Tag Search"}});
});

app.listen(process.env.PORT || 3000);