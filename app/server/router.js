var zipstream = require('zipstream'),
    fs = require('fs'),
    moment = require('moment'),
    ciadc = require('./ciadc.js');

ciadc.db = require('./ciadc.db.js');
var db = ciadc.db.create();


module.exports = function(app) {

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
        res.render('posts/' + url ,{post : post, moment:moment, ciadc:ciadc.utils, editable:false, key:false});
    });

    app.get('/tags/:tag', function(req, res){
        res.render('tags/holding-page', {post:{title : "Tag Search"}, editable:false});
    });



    app.get('/admin', function(req, res){
        var index = ciadc.utils.metadata('admin');

        var user = ciadc.db.get_user('', 'optimus');


        if (!user){
            res.render('admin/set' ,{post : index, moment:moment, ciadc:ciadc.utils, editable:false, key:false});
        } else if (!req.cookies.uid){
            //show login
        } else if (req.cookies.uid!=user.username || req.cookies.pass!=user.password){
            //show login with error
        } else {
            //show admin
        }
    });


    app.post('/admin/update/optimus', function(req, res){
        var index = ciadc.utils.metadata('admin');
        var user = ciadc.db.get_user('', 'optimus');
        console.log('user',user)
        if (!user){
            ciadc.db.update_user('', 'optimus',{username:req.param('username'),password:req.param('password')});
        }
        res.render('admin/set' ,{post : index, moment:moment, ciadc:ciadc.utils, editable:false, key:false});
    });

    app.get('/posts/:post/edit', function(req, res){
//    if (admin[req.cookies.uid] !== req.cookies.pass){
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('not found');
//    } else {
//        var post = ciadc.utils.metadata('posts',req.params.post),
//            url = (post) ? req.params.post : 'holding-page';
//        res.render('posts/' + url + '.jade',{post : post, moment:moment, ciadc:ciadc.utils, editable:true, key:Math.random()*10000000000000000});
//    }
    });

    app.post('/admin/update/:file', function(req, res){
//    if (admin[req.cookies.uid] !== req.cookies.pass){
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('not found');
//    } else {
//        var data = '',
//            oldFile = './admin/updates/' + req.params.file + '.html',
//            newFile = './admin/archive/' + req.params.file + '-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.html';
//        req.addListener('data', function(chunk) { data += chunk; });
//        req.addListener('end', function(){ciadc.updateFile(oldFile,newFile,data, res);});
//    }
    });


    app.get('/admin/archive', function(req, res){
//    if (admin[req.cookies.uid] !== req.cookies.pass){
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('not found');
//    } else {
//        fs.readdir('./admin/archive/', function(err, files){
//            if (files.length<1){ return; }
//            var out = fs.createWriteStream('./admin/archive-' + moment(new Date()).format('YYYYMMDDhhmmss') + '.zip'),
//                zip = zipstream.createZip({ level: 1 }),
//                fn = "zip.finalize(function(written) { console.log(written + ' total bytes written');});",
//                execute = "",
//                filename = "",
//                final = "",
//                len= files.length, f= 0;
//            zip.pipe(out);
//
//            for (f; f<len; f++){
//                filename = files[f];
//                execute +="zip.addFile(fs.createReadStream('./admin/archive/" + filename + "'),{name:'" + filename + "'},function(){";
//                fn += " fs.unlink('./admin/archive/" + filename + "',function(err){if (err) console.log(err);});";
//                if (f==len-1){
//                    execute += fn;
//                }
//                final += "});";
//            }
//            execute += final;
//            eval(execute);
//        });
//    }
    });



};