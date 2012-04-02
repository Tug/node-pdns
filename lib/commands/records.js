var app = require('flatiron').app;
var pdnsUtil = require('../util');
var pdns = require('../index')(pdnsUtil.config);

module.exports = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  var options = app.argv;
  var callback = args.pop();

  if(!options.domain) {
    callback(new Error("--domain, -d argument required"));
    return;
  }
  
  pdnsUtil.readArgs(args, argsOrder, function(err, command, record) {
    if(err) {
      callback(err);
      return;
    }
    pdns.records[command](options.domain, record, options, callback);
  });
  
};

var argsOrder = {
  list    : ['name', 'type', 'content', 'ttl'],
  add     : [{'name':1}, {'type':1}, {'content':1}, 'ttl'],
  remove  : [{'name':1}, 'type', 'content', 'ttl']
}

