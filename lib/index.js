var Step = require('step');

module.exports = function(config) {
  
  var adapter = require('./adapter/'+(config.adapter || 'mysql'));

  function auto(action) {
    return function() {
      var args = arguments;
      adapter.init(config, function() {
        action.apply(null, args);
      });
    };
  }
  
  return {
    domains: {
      list: auto(function(domain, options, callback) {
        adapter.domains.list(domain, callback);
      }),
      add: auto(function(domain, options, callback) {
        var records = [];
        var mx  = options.mx;
        var ns  = options.ns || 'ns1';
        var soa = options.soa;
        if(soa) {
          if(typeof soa == 'boolean') {
            soa = ns+'.'+domain.name+' admin@'+domain.name+' 2012032207 10800 7200 604800 10800';
          }
          records.push({name: domain.name, type:'SOA', content: soa});
        }
        if(options.ns) {
          records.push({name: ns+'.'+domain.name, type:'NS', content: ns});
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
      }),
      remove: auto(function(domain, options, callback) {
        adapter.domains.remove(domain, callback);
      })
    },
    records: {
      list: auto(function(domain, record, options, callback) {
        adapter.records.list(domain, record, callback);
      }),
      add: auto(function(domain, record, options, callback) {
        adapter.records.add(domain, record, callback);
      }),
      remove: auto(function(domain, record, options, callback) {
        adapter.records.remove(domain, record, callback);
      })
    }
  }
}


