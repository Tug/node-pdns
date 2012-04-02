var app = require('flatiron').app;
var pdnsUtil = require('../util');
var pdns = require('../index')(pdnsUtil.config);

module.exports = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  var options = app.argv;
  var callback = args.pop();
  
  pdnsUtil.readArgs(args, argsOrder, function(err, command, domain) {
    if(err) {
      callback(err);
      return;
    }
    pdns.domains[command](domain, options, callback);
  });
  
};

var argsOrder = {
  list    : ['name', 'type', 'ttl', 'created_at'],
  add     : [{'name':1}, 'type', 'ttl', 'notes'],
  remove  : [{'name':1}, 'type', 'ttl', 'created_at', 'updated_at']
}

