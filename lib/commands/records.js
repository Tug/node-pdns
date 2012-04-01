var app = require('flatiron').app;
var config = app.config.get("adapter");
var adapter = require('../adapter/'+config.type);

module.exports = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  var options = app.argv;
  var callback = args.pop();

  if(!options.domain) {
    callback(new Error("--domain, -d argument required"));
    return;
  }
  
  var commandName = args.shift();
  var action = commands[commandName];
  
  adapter.init(config, function(err) {
    action(args, options, callback);
  });
};

var commands = {
  list: function(args, options, callback) {
    var domainName = options.domain;
    var record = {
      name: args.shift(),
      type: args.shift(),
      content: args.shift(),
      ttl: args.shift() || 0
    };
    adapter.records.list(domainName, record, callback);
  },

  add: function(args, options, callback) {
    var domainName = options.domain;
    var record = {
      name: args.shift(),
      type: args.shift(),
      content: args.shift(),
      ttl: args.shift()
    };
    if(!record.name || !record.type || !record.content) {
      callback(new Error("Need a name, a type and a content"));
      return;
    }
    adapter.records.add(domainName, record, callback);
  },
  
  remove: function(args, options, callback) {
    var domainName = options.domain;
    var record = {
      name: args.shift(),
      type: args.shift(),
      content: args.shift(),
      ttl: args.shift() || 0
    };
    adapter.records.remove(domainName, record, callback);
  }
}

