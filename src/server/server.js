/**
 * Created by paul on 2/5/16.
 */
/* jshint node:true */
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');
var passport = require('passport');
var path = require('path');
var _ = require('lodash');
var Logger = require('./utils/log-manager').Logger;
var app = express();
var crypto = require('crypto');
var config = require('./config');

var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var mongoose = require('mongoose');
var mongooseConn = mongoose.createConnection(config.MONGO_URL);
mongoose.connect(config.MONGO_URL);
var sessionStore = new MongoStore({ mongooseConnection: mongooseConn });

var port = process.env.PORT || 3000;
global.projectPath = path.resolve(__dirname, '../../');
app.use('/release', express.static(global.projectPath + '/release'));
app.use('/bower_components', express.static(global.projectPath + '/bower_components'));
app.use(timeout(300000));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));

app.use(function hashPW(req, res, next) {
  if (typeof req.body.password  === 'string') {
    req.body.hiddenPW = crypto.createHash('sha256', config.USER_PW_SLAT)
      .update(req.body.password).digest('base64');
    delete req.body.password;
  }
  next();
});
app.use(expressSession({
  secret: 'labDoc_session_salt',
  store: sessionStore,
  cookie: { maxAge: 86400000 }, // 1 day
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  req.logger = new Logger({
    session: req.session
  });
  next();
});

require('./routes/authRouter')(app);
require('./routes/userRouter')(app);

app.get('/', function (req, res) {
  res.sendFile(global.projectPath + '/release/index.html');
});

app.listen(port, function () {
  console.log('the server is listening at port: ' + port);
});
