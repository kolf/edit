var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

var jwt = require('jsonwebtoken');
app.set('superSecret', 'secretOrPrivateKey');

app.set('host', (process.env.APIHOST || "localhost"));
app.set('port', (process.env.APIPORT || "3030"));

app.use('/', express.static(path.join(__dirname, 'api')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type');
  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

function requireAction(req, res) {

  var file = path.join(__dirname, '/api/' + req.params[0] + '.json'), method = req.method;

  console.log('filePath:' + file + "::method:" + method);

  fs.readFile(file, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    var resData = JSON.parse(data);
    console.log(req.params[0]);
    switch (req.params[0]) {
      case "login/authenticate":
        if (resData.code == 200) {
          var user = resData.data.user;
          var token = jwt.sign(user, app.get('superSecret'), {
            expiresIn: 86400 // expires in 24 hours
          });
          resData.data.token = token;
          res.json(resData);
        } else {
          res.json({ success: false, errorMessage: 'Authentication failed. User not found.' });
        }
        break;
      case "login/invalid":
        if (resData.code == 200) {
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

app.post('/upload', (req, res) => {
  console.log(req, res)
});


app.listen(app.get('port'), app.get('host'), function (error) {
  if (error) {
    console.error(error)
  } else {
    console.log('Server started: http://' + app.get('host') + ':' + app.get('port') + '/');
  }
})
