var fs = require('fs');
//var babelrc = fs.readFileSync('.babelrc');
//
//var config;
//try {
//  config = JSON.parse(babelrc);
//} catch (err) {
//  console.error('==>     ERROR: Error parsing your .babelrc.');
//  console.error(err);
//}
//
//console.log(config);
//require('babel-register')(config);
//console.log(config);
//
//require('babel-polyfill');

var express    = require('express');
//var session    = require('express-session');
var path       = require('path');
var bodyParser = require('body-parser');
//var socketIo   = require('socket.io');

var app = express();
//app.use(session({
//    secret: 'vcg rule',
//    resave: false,
//    saveUninitialized: false,
//    cookie: { maxAge: 60000 }
//}));
app.use('/', express.static(path.join(__dirname, 'api')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var host = process.env.APIHOST || "localhost";
var port = process.env.APIPORT || "3030";

var jwt        = require('jsonwebtoken');
app.set('superSecret', 'secretOrPrivateKey');

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

function requireAction(req, res){

      var file = path.join(__dirname, '/api/'+req.params[0]+'.json'),method = req.method;

      console.log('filePath:'+file+"::method:"+method);

      fs.readFile(file, function(err, data) {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        var resData = JSON.parse(data);
        console.log(req.params[0]);
        switch(req.params[0]){
          case "login/authenticate":
            if(resData.code==200){
              var user = resData.data.user;
              var token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: 86400 // expires in 24 hours
              });
              resData.data.token = token;
              res.json(resData);
            }else{
              res.json({ success: false, errorMessage: 'Authentication failed. User not found.' });
            }
            break;
          case "login/invalid":
            if(resData.code==200){
              // console.log(req.session);
              // req.session.user = null;
              // console.log(req.token);
              // res.redirect('/');
              res.json(resData);
            }
            break;
          default:
            res.json(resData);
        }

      });

}

var router = express.Router();

router.all('/api/*', requireAction);

app.use('/', router);

var serverAPI = app.listen(port, host, (err) => {
    if (err) {
        console.error(err);
    }
    console.info('----\n==> ?  API is running on port %s', port);
    console.info('==> ?  Send requests to http://%s:%s', host, port);
});

//var io = new socketIo();
//io.on('connection', (socket) => {
//
//});
//io.listen(serverAPI);
