/**
 * Created by paul on 3/6/16.
 */
/* jshint node:true */

'use strict';

var config = {
  HOST: process.env.HOST,
  MONGO_URL: process.env.MONGO_URL,
  USER_PW_SALT: process.env.USER_PW_SALT,
  FB_APP_ID: process.env.FB_APP_ID,
  FB_APP_SECRET: process.env.FB_APP_SECRET
};

for (var key in config) {
  if (config.hasOwnProperty(key) && config[key] === undefined) {
    console.log('missing environment variable: ' + key);
    process.exit(1);
  }
}

exports = module.exports = config;