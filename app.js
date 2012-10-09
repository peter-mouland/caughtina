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

var express = require('express'),
    app = express.createServer();


app.root = __dirname;
global.host = 'localhost';

require('./app/config')(app, express);
require('./app/server/router')(app);



app.listen(process.env.PORT || 3000, function(){
//    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});