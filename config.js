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
  items_per_page: 5,
  utils: {
      published_count: function(type){
          var i= 0,
              parent = ciadc[type],
              len = parent.length,
              count = 0;
          for (i;i<len;i++){
              if (parent[i].published) { count++; }
          }
          return count;
      },
      paged: function(type,page_number){
          var i= 0,
              parent = ciadc[type],
              len = (parent.length>ciadc.items_per_page)? ciadc.items_per_page : parent.length,
              pages = [];
          if (page_number){
              i=((page_number-1)*(len));
              len=i+len;
          }
          for (i;i<len;i++){
              if (parent[i].published) { pages.push(parent[i]); }
          }
          return {items:pages,current:page_number || 1, count:(Math.ceil(ciadc.utils.published_count(type)/ciadc.items_per_page))};
      },
      metadata: function(type,url) { //todo: improve s will get slow with lots of posts
          var i= 0,
              parent = ciadc[type],
              len = parent.length;
          for (i;i<len;i++){
              if (parent[i].url == url) { return parent[i]; }
          }
          return false;
      },
      urlHelper: function(type,url){
          var md = ciadc.utils.metadata(type,url); //todo: cache url result so dont have to look up again
          return '<a href="/'+ type + '/' + md.url + '" >' + md.title + '</a>'
      },
      urlHelper_subtitle: function(type,url){ //todo: cache url result so dont have to look up again
          var md = ciadc.utils.metadata(type,url);
          return '<a href="/'+ type + '/' + md.url + '" >' + md.subtitle + '</a>'
      }
  }
};

ciadc.index = [
    {   url: '/',
        title: 'all posts',
        published: '2012-07-16',
        lastUpdated: '2012-09-26',
        author:'peter-mouland',
        dataCode: ''
    }
];

ciadc.posts = [
    {   url:'using-html5-in-production',
        title:'using html5 in production',
        published: '2012-07-16',
        lastUpdated: '2012-07-30',
        author: 'peter-mouland',
        dataCode: '',
        summary: 'I\'ve seen many people question html5. Some say \'why bother, there\'s not enough support\'. ' +
            'Others saying \'just use it as no one should be using IE anyway\'!',
        tags: [
            {   title: 'Accessibility',
                url: 'accessibility'
            },
            {   title: 'HTML5',
                url: 'html5'
            }
        ]
    },
    {   url:'client-side-kickstart',
        title:'a client side kickstart',
        subtitle:'introduction',
        published: '2012-08-16',
        lastUpdated: '2012-08-26',
        author: 'peter-mouland',
        summary: 'I\'ve been asked to put together some training notes for server-side developers to help them tackle common client-side problems. ' +
            'So here is my attempt!',
        tags: [
            {   title: 'Accessibility',
                url: 'accessibility'
            },
            {   title: 'CSS',
                url: 'css'
            }
        ]
    },
    {   url:'client-side-kickstart-design-to-web',
        title:'a client side kickstart',
        subtitle:'part 1 : design to web',
        published: '2012-08-30',
        lastUpdated: '2012-09-26',
        author: 'peter-mouland',
        summary: 'the first of 7 posts looking into kick-starting client-side development. ' +
            'here I look into what to think about when you see a design that needs to be turned into a web page',
        tags: [
            {   title: 'Accessibility',
                url: 'accessibility'
            },
            {   title: 'CSS',
                url: 'css'
            }
        ]
    },
    {   url:'client-side-kickstart-document-flow',
        title:'a client side kickstart',
        subtitle:'part 2 : document flow',
        published: '2012-09-10',
        lastUpdated: '2012-09-26',
        author: 'peter-mouland'
    },
    {   url:'client-side-kickstart-css3',
        title:'a client side kickstart',
        subtitle:'part 3 : css3',
        published: null,
        lastUpdated: '2012-09-26',
        author: 'peter-mouland'
    },
    {   url:'client-side-kickstart-ui',
        title:'a client side kickstart',
        subtitle:'part 4 : ui',
        published: null,
        lastUpdated: null,
        author: 'peter-mouland'
    },
    {   url:'client-side-kickstart-javascript',
        title:'a client side kickstart',
        subtitle:'part 5 : javascript',
        published: null,
        lastUpdated: null,
        author: 'peter-mouland'
    },
    {   url:'client-side-kickstart-devices',
        title:'a client side kickstart',
        subtitle:'part 6 : devices',
        published: null,
        lastUpdated: null,
        author: 'peter-mouland'
    },
    {   url:'client-side-kickstart-tracking',
        title:'a client side kickstart',
        subtitle:'part 7 : tracking',
        published: null,
        lastUpdated: null,
        author: 'peter-mouland'
    }
].sort(function(a,b){return (b.published && a.published != b.published);});


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
    res.render('index',{post:ciadc.index[0], moment:moment, ciadc:ciadc.utils, this_page:1});
});

app.get('/page/:page', function(req, res){
    res.render('index',{post:ciadc.index[0], moment:moment, ciadc:ciadc.utils, this_page: req.params.page});
});

app.get('/about', function(req, res){
    res.render('about/caught-in-a-dot-com', {post:{title : "about caught in a dot com"}});
});

app.get('/posts/:post', function(req, res){
    var post = ciadc.utils.metadata('posts',req.params.post),
        url = (post) ? req.params.post : 'holding-page';
    res.render('posts/' + url + '.jade',{post : post, moment:moment, ciadc:ciadc.utils});
});

app.get('/tags/:tag', function(req, res){
    res.render('tags/holding-page.jade', {post:{title : "Tag Search"}});
});

app.listen(process.env.PORT || 3000);