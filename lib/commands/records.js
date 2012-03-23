var app = require('flatiron').app;
var config = app.config.get("adapter");
var adapter = require('../adapter')(config.type);

module.exports = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  //var callback = args.pop();
  if(args.length < 3) {
    usage();
    return;
  }
  var subCommand = args.shift();
  if(!adapter.records[subCommand]) {
    subCommand = 'list';
  }
  var action = adapter.records[subCommand];
  adapter.init(config, function(err) {
    action.apply(null, args);
  });
};

function usage() {
  console.log("records list domain_name");
  console.log("records add domain_name name type content ttl");
  console.log("records remove domain_name name");
}

