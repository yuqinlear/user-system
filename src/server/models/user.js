/**
 * Created by paul on 3/5/16.
 */
/* jshint node: true */
'use strict';

var _ = require('lodash');
var mongoose = require('mongoose'),
  findOrCreate = require('mongoose-findorcreate'),
  Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    title: {
      type: String
    },
    experience: {
      type: Number
    },
    localUser: {
      username: String,
      hiddenPW: String,
      lastname: String,
      firstname: String,
      email: String //TODO: validate email
    },
    fbUser: {
      id: String,
      accessToken: String,
      displayName: String,
      gender: String,
      email: String,
      name: {
        familyName: String,
        givenName: String,
        middleName: String
      }
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

userSchema.virtual('displayName')
  .get(function () {
    if (!_.isEmpty(this.localUser.firstname) || !_.isEmpty(this.localUser.lastname)) {
      return this.localUser.firstname + ' ' + this.localUser.lastname;
    }
    if (!_.isEmpty(this.fbUser.displayName)) {
      return this.fbUser.displayName;
    }
    return this.localUser.username;
  });

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
