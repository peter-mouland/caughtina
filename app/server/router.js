var page_manager = require('./modules/page-manager'),
    database_manager = require('./modules/database-manager'),
    PM = new page_manager(),
    DBM = new database_manager(),
    getLocals = function(req, pageType, pageItem){
        var contents = PM.metadata(pageType, pageItem),
            user = DBM.getUser(req),
            page = req.params.page || 1,
            editable = false,
            updateable = false;
        return {post:contents, ciadc:PM, this_page: page, user:user, editable:editable, updateable:updateable};
    };

module.exports = function(app) {

    app.get('/1/:a/:b/:c/:d', function(req, res){
        //todo call this on app load
        DBM.signup({admin:true,username:req.params.a, email:req.params.b, password:req.params.c, name: req.params.d}, function(s, user){
            if (s==null){
                res.send('added: ' + user.name, 200);
            } else {
                res.send(s, 400);
            }
        });
    });

    app.get('/', function(req, res){
        var locals = getLocals(req, 'index');
        res.render('index', locals);
    });

    app.get('/page/:page', function(req, res){
        var locals = getLocals(req, 'index');
        res.render('index', locals);
    });

    app.post('/login', function(req, res){
        DBM.login(req.param('username'), req.param('password'), function(e, user){
            if (!user){
                res.send(e, 400);
            }	else{
                user.is_admin = DBM.isAdminUser(user);
                req.session.user = user;
                if (req.param('remember-me') == 'true'){
                    res.cookie('username', user.username, { maxAge: 900000 });
                    res.cookie('password', user.password, { maxAge: 900000 });
                }
                res.redirect(req.header('referrer'));
            }
        });
    });

    app.get('/logout', function(req, res){
        req.session.user = undefined;
        res.redirect('/');
    });

    app.get('/about', function(req, res){
        var locals = getLocals(req, 'about');
        res.render('about/caught-in-a-dot-com', locals);
    });

    app.get('/posts/:post', function(req, res){
        var locals = getLocals(req, 'posts', req.params.post),
            url = (locals.post) ? req.params.post : 'holding-page';
        locals.editable = true;
        res.render('posts/' + url, locals);
    });

    app.get('/posts/:post/edit', function(req, res){
        var locals = getLocals(req, 'posts', req.params.post),
            url = (locals.post) ? req.params.post : 'holding-page';
        if (!locals.user || !locals.user.is_admin){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('not found');
        } else {
            locals.updateable = true;
            res.render('posts/' + url, locals);
        }
    });

    app.get('/tags/:tag', function(req, res){
        res.render('tags/holding-page', {post:{title : "Tag Search"}, editable:false,user : DBM.getUser(req)});
    });

    app.get('/admin', function(req, res){
        var locals = getLocals(req, 'admin');

        if (!locals.user){
            //show login
        } else if (!locals.user.is_admin){
            //show login with error
        } else {
            //show admin
        }
    });


    app.post('/admin/update/:file', function(req, res){
        var user = DBM.getUser(req);
        if (!user || !user.is_admin){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('not found');
        } else {
            PM.update_file(req, req.params.file, function(){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end('{"saved":"true"}');
            });
        }
    });



    app.get('/admin/clearCache', function(req, res){
        var user = DBM.getUser(req);
        if (!user || !user.is_admin){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('not found');
        } else {
            PM.delete_files('app/public','posts',function(count){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end('{"cleared":"' + count + '"}');
            });
        }
    });


    app.get('/admin/archive', function(req, res){
        var user = DBM.getUser(req);
        if (!user.is_admin){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('not found');
        } else {
            PM.archive_directory('app/server/admin','archive',function(){
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end('{"archived":"true"}');
            });
        }
    });



};