/**
 * Created by paul on 3/5/16.
 */
/* jshint node: true */
'use strict';

var _ = require('lodash');
var express = require('express'),
  passport = require('passport'),
  User = require('../models/user'),
  config = require('../config'),
  LocalStrategy = require('passport-local').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (app) {

  //TODO: refactor each strategy as a module into their own files

  //local strategy
  app.post('/api/auth/local',
    function (req, res, next) {
      // PassportJs: when using a custom callback, it becomes the application's responsibility to establish a session
      // (by calling req.login())
      passport.authenticate('local', function (err, user, info) {
        if (err) {
          return res.status(500).json({ err: err });
        }
        if (!user) {
          return res.status(401).json({ err: info });
        }
        req.login(user, function (err) {
          if (err) {
            return res.status(500).json({ err: 'login failed' });
          }
          res.status(200).json({ status: 'Login successfully!' });
        });
      })(req, res, next);
    }
  );

  passport.use(
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'hiddenPW'
      },
      function (username, hiddenPW, done) {
        User.findOne({ 'localUser.username': username, 'localUser.hiddenPW': hiddenPW }).then(
          function (user) {
            return done(null, user);
          },
          function (err) {
            return done(err, false, err.message);
          }
        );
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    //return done(null, {});  // uncomment this line for debug;
    User.findById(id).then(
      function (user) {
        return done(null, user);
      },
      function (err) {
        err.message += '/n This user might be removed from the system!';
        return done(err, false, err.message);
      }
    );
  });

  // facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.FB_APP_ID,
      clientSecret: config.FB_APP_SECRET,
      callbackURL: 'http://' + config.HOST + '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email']
    },
    function (accessToken, refreshToken, profile, done) {
      //TODO: optimize findOrCreate(), also make a promise API;
      var newUser = {
        experience: 0,
        fbUser: {
          id: profile.id,
          displayName: profile.displayName,
          email: _.isEmpty(profile.emails[0]) ? '' : profile.emails[0].value,
          accessToken: accessToken,
          expires: profile.expires,
          name: profile.name
        }
      };
      User.findOrCreate({ 'fbUser.id': newUser.fbUser.id }, newUser, function (err, user, create) {
        if (err) {
          done(err, null);
        } else {
          done(null, user);
        }
      });
    }
  ));

  app.get('/api/auth/facebook', passport.authenticate('facebook',
    { scope: ['public_profile', 'email'] }));

  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook',
      {
        successRedirect: '/#/',
        failureRedirect: '/#/login' }
    ));

};

