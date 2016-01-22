'use strict';

var path = require('path');
var _ = require('lodash');

var all = {
  env: process.env.NODE_ENV,

  root: path.normalize(__dirname + '/../../..'),

  port: process.env.PORT || 9000

};

if ('production' === process.env.NODE_ENV) {
  all = _.merge(
    all,
    require('./production') || {}
  );
}
module.exports = all;
