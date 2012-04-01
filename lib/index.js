var app = require('flatiron').app;
var config = app.config;

module.exports = require('./adapter/'+(config.get("adapter") || 'mysql'));

