var app = require('flatiron').app;
var config = app.config.get("adapter");
var adapter = require('../adapter/'+config.type);
var Step = require('step');

module.exports = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  var options = app.argv;
  var callback = args.pop();
  
  var commandName = args.shift();
  var action = commands[commandName];
  
  adapter.init(config, function(err) {
    action(args, options, callback);
  });
};

var commands = {
  
  list: function(args, options, callback) {
    adapter.domains.list(callback);
  },

  add: function(args, options, callback) {
    var domain = {
      name: args.shift(),
      type: args.shift(),
      ttl: args.shift(),
      notes: args.shift()
    };
    var records = [];
    var mx = options.mx;
    var ns = options.ns;
    var soa = options.soa;
    if(soa) {
      if(typeof soa == 'boolean') {
        soa = 'ns1.'+domain.name+' admin@'+domain.name+' 2012032207 10800 7200 604800 10800';
      }
      records.push({name: domain.name, type:'SOA', content: soa});
    }
    if(ns) {
      records.push({name: 'ns1.'+domain.name, type:'NS', content: ns});
    }
    if(mx) {
      if(typeof mx == 'boolean') {
        mx = 'mail';
      }
      records.push({name: domain.name, type:'MX', content: mx});
    }
    adapter.domains.add(domain, function(err, result) {
      if(err || !result) {
        callback(err, result);
        return;
      }
      Step(function() {
        var group = this.group();
        records.forEach(function(record) {
          adapter.records.add(domain.name, record, group());
        });
      }, function() {
        callback(err, result);
      });
    });
  },
  
  remove: function(args, options, callback) {
    var domain = {
      name: args.shift(),
      type: args.shift(),
      ttl: args.shift(),
      created_at: args.shift(),
      updated_at: args.shift()
    };
    adapter.domains.remove(domain, callback);
  }
  
}

