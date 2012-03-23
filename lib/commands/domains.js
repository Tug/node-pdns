var app = require('flatiron').app;
var config = app.config.get("adapter");
var adapter = require('../adapter')(config.type);

module.exports = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  //var callback = args.pop();
  if(args.length < 2) {
    usage();
    return;
  }
  var subCommand = args.shift();
  if(!adapter.domains[subCommand]) {
    subCommand = 'list';
  }
  var action = adapter.domains[subCommand];
  adapter.init(config, function(err) {
    action.apply(null, args);
  });
};

function usage() {
  console.log("domains list");
  console.log("domains add domain_name ttl");
}
