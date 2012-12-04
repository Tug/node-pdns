var app = require('flatiron').app;
var dateFormat = require('dateformat');
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

var soaSerial = module.exports.soaSerial = function(serial) {
  var currentDate = dateFormat(new Date(), "yyyymmdd");
  if(checkString(serial) && serial.slice(0,8) == currentDate) {
    var inc = Number(serial.slice(8,10)) || 0;
    return currentDate + pad(inc+1, 2);
  } else {
    return currentDate+'01';
  }
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

var updateSoa = module.exports.updateSoa = function(soaContent) {
  var soaItems = soaContent.split(' ');
  if(soaItems.length < 3) return soaContent;
  else {
    soaItems[2] = soaSerial(soaItems[2]);
    return soaItems.join(' ');
  }
}

