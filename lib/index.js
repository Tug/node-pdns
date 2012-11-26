var Step = require('step');
var checkDomainName = require('./util').checkDomainName;

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
        var ns  = options.ns;
        var soa = options.soa;
        if(ns) {
          if(typeof ns == 'boolean') {
            ns = 'ns1';
          }
          if(!checkDomainName(ns)) {
            ns += '.'+domain.name;
          }
          records.push({name: domain.name, type:'NS', content: ns});
        }
        if(mx) {
          if(typeof mx == 'boolean') {
            mx = 'mail';
          }
          if(!checkDomainName(mx)) {
            mx += '.'+domain.name;
          }
          records.push({name: domain.name, type:'MX', content: mx});
        }
        if(soa) {
          if(typeof soa == 'boolean') {
            var primary = ns || 'ns1.'+domain.name;
            var hostmaster = 'admin@'+domain.name;
            var serial = '0';           // 0 means powerdns will do the work for you
            var refresh = '10800';      // 3 hours
            var retry = '7200';         // 2 hours
            var expire = '604800';      // 1 week
            var defaultTTL = '10800';   // 3 hours
            soa = [primary, hostmaster, serial, refresh, retry, expire, defaultTTL].join(' ');
          }
          records.unshift({name: domain.name, type:'SOA', content: soa});
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


