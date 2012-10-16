//$ cd DevRoot/heroku/caughtina/
//$ git push heroku-caughtina
//todo: gzip static assets
//todo: improve cache busting of assets for new builds
//todo: write path to download all page versions and delete on server
//todo: write updates to deal with multiple users
//todo: make admin cookie secure with login
//todo: put admin check in function
//todo: write full page html generator
//todo: use local storage to save document updates when offline
//todo: create tags pages
//todo: workout how to synchronise changes between local(offline) and web
//todo: move admin css/js to its own files and download when verified

var express = require('express'),
    app = express.createServer();

app.root = __dirname;
var port = process.env.PORT || 3000;
var mongoUri = process.env.MONGOLAB_URI;

require('./app/config')(app, express);
require('./app/server/router')(app);

app.listen(port || 3000, function(){
//    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});