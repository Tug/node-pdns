var app = require('flatiron').app;
var config = app.config;

module.exports.config = {
  adapter   : config.get("adapter"),
  db        : config.get("db"),
  user      : config.get("user"),
  password  : config.get("password")
};

module.exports.readArgs = function(args, argsOrder, callback) {
  var command = args.shift();
  if(!argsOrder[command]) {
    callback(new Error("Command "+command+" not available"));
    return;
  }
  var record = {};
  argsOrder[command].forEach(function(arg) {
    if(typeof arg === 'object') {
      for(var name in arg) {
        record[name] = args.shift();
        var mandatory = arg[name];
        if(mandatory && record[name] === undefined) {
          callback(new Error("Mandatory parameter "+name+" is not defined"));
          return;
        }
      }
    } else if(typeof arg === 'string') {
      record[arg] = args.shift();
    }
  });
  callback(null, command, record);
}


