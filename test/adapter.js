var assert = require('assert');
require('../app');
var app = require('flatiron').app;
var config = app.config.get("adapter");

var adapter = require('../lib/adapter')(config.type);

adapter.init(config, function(err) {
  assert.equal(err, null);

  adapter.domains.list(function(err, res) {
    console.log(res);
  });

  adapter.records.list('example.com', function(err, res) {
    console.log(res);
  });
  
});
