var page_manager = require('./modules/page-manager'),
    database_manager = require('./modules/database-manager'),
    user_manager = require('./modules/user-manager'),
    DBM = new database_manager(),
    PM = new page_manager(DBM),
    UM = new user_manager(DBM),
    getLocals = function(req){
        global.url = req.url;
        var user = UM.getUser(req),
            editable = false,
            updateable = false;
        return {ciadc:PM, user:user, editable:editable, updateable:updateable};
    };

module.exports = function(app) {

    app.get('/add/:a/:b/:c/:d', function(req, res){
        //todo call this on app load
        UM.signup({admin:true,username:req.params.a, email:req.params.b, password:req.params.c, name: req.params.d}, function(s, user){
            if (s==null){
                res.send('added: ' + user.name, 200);
            } else {
                res.send(s, 400);
            }
        });
    });

    app.get('/:page((\\d+))?', function(req, res){
        var locals = getLocals(req);
        PM.metadata('index', '/', function(index){
            locals.post = index;
            locals.tag = 'all';
            PM.paged('post',req.params.page || 1, locals.tag, function(page){
                locals.page = page
                res.render('index', locals);
            });
        });
    });

    app.post('/login', function(req, res){
        UM.login(req.param('username'), req.param('password'), function(e, user){
            if (!user){
                res.send(e, 400);
            }	else{
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
        var locals = getLocals(req);
        PM.alldata('about', '/about', function(post){
            locals.post = post;
            res.render('about', locals);
        });
    });

    app.get('/posts/:post', function(req, res){
        var locals = getLocals(req);
        locals.editable = true;
        PM.alldata('post', '/posts/' + req.params.post, function(post){
            locals.post = post;
            res.render('post', locals);
        });
    });
    app.get('/tags/:tag(css|js|html|html5|accessibility):format(.json)?:page(/(\\d+))?', function(req, res){
        var locals = getLocals(req);
        PM.metadata('index', '/', function(post){
            locals.post = post;
            locals.tag = req.params.tag;
            PM.paged('post',req.params.page || 1, locals.tag, function(page){
                if (req.params.format=='.json'){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(page));
                } else{
                    locals.page = page
                    res.render('index', locals);
                }
            });
        })

    });

//    app.get('/posts/:post/edit', function(req, res){
//        var locals = getLocals(req, 'posts', req.params.post),
//            url = (locals.post) ? '.' + req.url  : './posts/holding-page';
//        if (!locals.user || !locals.user.admin){
//            res.writeHead(404, {'Content-Type': 'text/html'});
//            res.end('not found');
//        } else {
//            locals.updateable = true;
//            res.render(url, locals);
//        }
//    });
//
//    app.get('/tags/:tag', function(req, res){
//        res.render('tags/holding-page', {post:{title : "Tag Search"}, editable:false,user : UM.getUser(req)});
//    });
//
//    app.get('/admin', function(req, res){
//        var locals = getLocals(req, 'admin');
//
//        if (!locals.user){
//            show login
//        } else if (!locals.user.admin){
            //show login with error
//        } else {
            //show admin
//        }
//        res.writeHead(404, {'Content-Type': 'text/html'});
//        res.end('not found');
//    });
//
//
//    app.post('/admin/update/:file', function(req, res){
//        var user = UM.getUser(req);
//        if (!user || !user.admin){
//            res.writeHead(404, {'Content-Type': 'text/html'});
//            res.end('not found');
//        } else {
//            PM.update_file(req, req.params.file, function(){
//                res.writeHead(200, {'Content-Type': 'text/html'});
//                res.end('{"saved":"true"}');
//            });
//        }
//    });

    app.get('/admin/pukePages', function(req, res){
        var user = UM.getUser(req);
        if (!user || !user.admin){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('not found');
        } else {
            DBM.pukePages();
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('{"called":"hugo"}');
        }
    });

    app.get('/admin/publicInfo', function(req, res){
        var user = UM.getUser(req);
        if (!user || !user.admin){
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('not found');
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(process.env));
        }
    });

//    app.get('/admin/clearCache', function(req, res){
//        var user = UM.getUser(req);
//        if (!user || !user.admin){
//            res.writeHead(404, {'Content-Type': 'text/html'});
//            res.end('not found');
//        } else {
//            PM.delete_files('app/public','posts',function(count){
//                res.writeHead(200, {'Content-Type': 'text/html'});
//                res.end('{"cleared":"' + count + '"}');
//            });
//        }
//    });
//
//
//    app.get('/admin/archive', function(req, res){
//        var user = UM.getUser(req);
//        if (!user.admin){
//            res.writeHead(404, {'Content-Type': 'text/html'});
//            res.end('not found');
//        } else {
//            PM.archive_directory('app/server/admin','archive',function(){
//                res.writeHead(200, {'Content-Type': 'text/html'});
//                res.end('{"archived":"true"}');
//            });
//        }
//    });
//
//

};
