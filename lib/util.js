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

var checkDomainName = module.exports.checkDomainName = function(obj) {
  if(!checkString(obj)) return false;
  var words = obj.split('.');
  if(words.length < 2) return false;
  var wordsOk = true;
  words.forEach(function(w) {
    wordsOk &= checkString(w);
  });
  return wordsOk;
}


var trim = module.exports.trim = function(str) {
	var	str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

var checkString = module.exports.checkString = function(obj) {
  return (obj && typeof obj == 'string' && obj.length > 0);
}


