var mysql = require('mysql');
var spawn = require('child_process').spawn;
var client = null;


function createTablesIfNotExist(config, callback) {
  spawn('mysql', ['-u',config.user, '-p', config.password]);
}

var adapter = module.exports = {

  init: function(config, callback) {
    client = mysql.createClient(config);
    client.useDatabase(config.db, function(err) {
      callback(err);
    });
  },

  domains: {
    
    list: function(callback) {
      client.query('SELECT * FROM domains', function(err, results, fields) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, results);
      });
    },
    
    add: function(name, ttl, callback) {
      ttl = ttl || 0;
      client.query('INSERT INTO domains SET name=?, ttl=?',
                   [name, ttl],
                   callback);
    },

    remove: function(domain, callback) {
      client.query('DELETE FROM domains WHERE name=?',
                   [domain],
                   callback);
    }
  },

  records: {
    
    list: function(domain, callback) {
      client.query('SELECT R.* FROM records R JOIN domains D WHERE D.name=?',
                   [domain],
                   function(err, results, fields) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, results);
      });
    },

    add: function(domain, name, type, content, ttl, callback) {
      name += '.'+domain;
      type = type || 'A';
      ttl = ttl || 0;
      client.query('INSERT INTO records SET '
                  +'domain_id=(SELECT id FROM domains WHERE name=? LIMIT 1), '
                  +'name=?, type=?, content=?, ttl=?',
                   [domain, name, type, content, ttl],
                   callback);
    },

    remove: function(domain, name, callback) {
      client.query('DELETE FROM records WHERE name=?',
                   [name+'.'+domain],
                   callback);
    }
  }

};

