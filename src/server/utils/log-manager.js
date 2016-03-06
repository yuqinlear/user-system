/**
 * Created by paul on 2/14/16.
 */
/* jshint node: true */
'use strict';

var _ = require('lodash');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'logs/backend.log' });

function Logger(defaultFields) {
  this.defaultFields = defaultFields;
}

Logger.prototype.info = function (message, includeMemoryUsage) {
  if (includeMemoryUsage) {
    if (!_.isObject(message)) {
      message = { message: message };
    }
    var memUsage = process.memoryUsage();
    message.memory = {
      total: memUsage.heapTotal / 1048576,
      used: memUsage.heapUsed / 1048576
    };
  }
  this.write('info', message);
};

Logger.prototype.error = function (error, message, statusCode, body) {
  if (message) {
    wrapError(error, message, statusCode, body);
  }
  this.write('error', error);
};

Logger.prototype.timer = function (message) {
  var self = this;
  message.updates = [];
  var startTime = process.hrtime();
  return function (update) {
    var elapsedTime = process.hrtime(startTime);
    var ms = (elapsedTime[0] * 1000) + (elapsedTime[1] / 1000000);
    if (_.isString(update)) {
      message.updates.push(ms + 'ms : ' + update);
    } else {
      message.elapsedTime = ms + 'ms';
      self.write('timer', message);
    }
  };
};

Logger.prototype.write = function (type, message) {
  if (message instanceof Error) {
    message = {
      message: message.toString(),
      stack: message.stack,
      statusCode: message.statusCode,
      body: message.body
    };
  } else if (!_.isObject(message)) {
    message = { message: message };
  }
  message.logType = type;
  _.extend(message, this.defaultFields);
  winston.log(type, JSON.stringify(message));
};

function wrapError(error, message, statusCode, body) {
  if (error.message && error.message.length > 0) {
    error.message = message + ' || ' + error.message;
  } else {
    error.message = message;
  }
  error.statusCode = statusCode;
  error.body = body;
}

exports.Logger = Logger;
