var zipstream = require('zipstream'),
    fs = require('fs'),
    events= require('events'),
    moment = require('moment'),
    ciadc = require('./ciadc.js'),
    account_manager = require('./modules/account-manager');

ciadc.db = require('./ciadc.db.js');
var db = ciadc.db.create(),
    AM = new account_manager({
        dbPort: 27017,
        dbHost: global.host,
        dbName: 'ciadc'});

ciadc.checkLogin = function(req,success, fail){
    // check if the user's credentials are saved in a cookie //
    if (req.cookies.user == undefined || req.cookies.pass == undefined){
        fail();
    }	else{
        // attempt automatic login //
        AM.autoLogin(req.cookies.user, req.cookies.pass);
        AM.on('autoLogin.fail', fail);
        AM.on('autoLogin.success', success);
    }
};
ciadc.getUser = function(req){
    return (req.session && req.session.user != null) ? req.session.user : undefined;
};
ciadc.isAdminUser = function(user){
    return (user!=null && user.email=='peter.mouland@gmail.com')
};

module.exports = function(app) {

    app.get('/1/:a/:b/:c/:d', function(req, res){
        //todo call this on app load
        AM.signup({user:req.params.a, email:req.params.b, pass:req.params.c}, function(s){
            if (s==null){
                res.send(o, 200);
            } else {
                res.send(s, 400);
            }
        });
    });

    app.get('/', function(req, res){
        var index = ciadc.utils.metadata('index'),
            user = ciadc.getUser(req);
        res.render('index',{post:index, moment:moment, ciadc:ciadc.utils, this_page:1, editable:false, user:user});
    });

    app.post('/login', function(req, res){
        AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
            if (!o){
                res.send(e, 400);
            }	else{
                req.session.user = o;
                if (req.param('remember-me') == 'true'){
                    res.cookie('user', o.user, { maxAge: 900000 });
                    res.cookie('pass', o.pass, { maxAge: 900000 });
                }
                res.redirect('/');
            }
        });
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
        res.render('posts/' + url ,{post : post, moment:moment, ciadc:ciadc.utils, editable:false, key:false});
    });

    app.get('/tags/:tag', function(req, res){
        res.render('tags/holding-page', {post:{title : "Tag Search"}, editable:false});
    });



    app.get('/admin', function(req, res){
        var index = ciadc.utils.metadata('admin');
        var user = ciadc.getUser(req);

        if (!user){
            //show login
        } else if (!ciadc.isAdminUser(user)){
            //show login with error
        } else {
            //show admin
        }
    });

    app.get('/posts/:post/edit', function(req, res){
        var user = ciadc.getUser(req);
        if (!ciadc.isAdminUser(user)){
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.end('not found');
        } else {
            var post = ciadc.utils.metadata('posts',req.params.post),
                url = (post) ? req.params.post : 'holding-page';
            res.render('posts/' + url,{post : post, moment:moment, ciadc:ciadc.utils, editable:true, key:Math.random()*10000000000000000});
        }
    });

    app.post('/admin/update/:file', function(req, res){
        var user = ciadc.getUser(req);
        if (!ciadc.isAdminUser(user)){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('not found');
        } else {
            var data = '',
                oldFile = 'app/server/admin/updates/' + req.params.file + '.html',
                newFile = 'app/server/admin/archive/' + req.params.file + '-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.html';
            req.addListener('data', function(chunk) { data += chunk; });
            req.addListener('end', function(){ciadc.updateFile(oldFile,newFile,data, res);});
        }
    });


    app.get('/admin/archive', function(req, res){
        var user = ciadc.getUser(req);
        if (!ciadc.isAdminUser(user)){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('not found');
        } else {
            fs.readdir('app/server/admin/archive/', function(err, files){
                if (files.length<1){ return; }
                var out = fs.createWriteStream('app/server/admin/archive-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.zip'),
                    zip = zipstream.createZip({ level: 1 }),
                    fn = "zip.finalize(function(written) { console.log(written + ' total bytes written');});",
                    execute = "",
                    filename = "",
                    final = "",
                    len= files.length, f= 0;
                zip.pipe(out);

                for (f; f<len; f++){
                    filename = files[f];
                    execute +="zip.addFile(fs.createReadStream('app/server/admin/archive/" + filename + "'),{name:'" + filename + "'},function(){";
                    fn += " fs.unlink('app/server/admin/archive/" + filename + "',function(err){if (err) console.log(err);});";
                    if (f==len-1){
                        execute += fn;
                    }
                    final += "});";
                }
                execute += final;
                eval(execute);
                res.writeHead(200, {'Content-Type': 'text/html'});
            });
        }
    });



};