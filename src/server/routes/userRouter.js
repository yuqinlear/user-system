/**
 * Created by paul on 2/21/16.
 */
/* jshint node: true */
'use strict';

var express = require('express'),
  passport = require('passport'),
  User = require('../models/user'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = userRouter;

function userRouter(app) {

  app.post('/api/current-user',
    function (req, res) {
      if (!req.body.username || !req.body.hiddenPW)  { // TODO: validate username
        res.status(400).send('invalid username !');
      }
      var theUser = new User({
        experience: 0,
        localUser: req.body
      });
      theUser.save().then(
        function (user) {
          res.status(200).send(user);
        },
        function (err) {
          if (err.status === 400) {
            res.status(400).send({ message: err.message });
          } else {
            res.status(500).send('cannot create the user due to system internal error');
          }
        }
      );
    });

  app.get('/api/current-user', validAuth,
    function (req, res) {
      res.status(200).send(req.user);
    });

  app.delete('/api/current-user/session', validAuth,
    function (req, res) {
      req.logout();
      req.session.destroy();
      res.status(200).send(req.user);
    });

}

function validAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
  } else {
    next();
  }
}
