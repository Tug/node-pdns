var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app,
    cliff = require('cliff');

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });
app.use(flatiron.plugins.cli, {
  source: path.join(__dirname, 'lib', 'commands'),
  usage: [
"domains [list|add|remove]",
"domains list [<name> [<type> [<ttl> [<created_at>]]]] : List all domains",
"domains add <name> <type> <content> [<ttl>] [--soa [<soa_content>]] [--mx [<mx_content>]] [--ns [<ns_content>]] : Add a new domain",
"\t --soa : Generate a default SOA record",
"\t --soa=<soa_content> : Generate a SOA record using the soa_content parameter",
"\t --mx : Generate a default MX record",
"\t --mx=<mx_content> : Generate an MX record using the mx_content parameter",
"\t --ns=<ns_content> : Generate an NS record using the ns_content parameter",
"domains remove <name> [<type> [<ttl> [<created_at> [updated_at]]]] : Remove all domains matching the parameters", 
"",
"records [list|add|remove]",
"records list [<name> [<type> [<content>]]] --domain=<domain_name> : List all records for domain_name",
"records add <name> <type> <content> [<ttl>] --domain=<domain_name> : Add a new record for domain_name",
"records remove <name> [<type> [<content> [<ttl>]]] --domain=<domain_name> : Remove all records matching the parameters"
],
  argv: {
    domain: {
      alias: 'd',
      description: 'Domain to use for records',
      string: true
    },
    ns: {
      description: 'NameServer ip when adding a new domain, name is "ns1.<domain_name>", must enter a value',
      string: true
    },
    soa: {
      description: 'Start of autority when adding a new domain, default is "ns1.<domain_name> admin@<domain_name> 2012032207 10800 7200 604800 10800"'
    },
    mx: {
      description: 'SMTP server when adding a new domain, default is "mail"'
    },
  }
});

app.use(require('flatiron-cli-config'));

app.start(function(err, result) {
  if(err) {
    console.log(err.message);
  }
  if(result) {
    if(result.affectedRows !== undefined) {
      console.log("Affected rows : "+result.affectedRows);
    }
    if(result.message) {
      console.log(message);
    }
    if(typeof result == 'object' && result.constructor == Array) {
      printArray(result);
    } else if(typeof result == 'string') {
      console.log(result);
    }
  }
  process.exit(1);
});

function printArray(arr) {
  if(arr.length == 0) return;
  var keys = getKeys(arr[0]);
  cliff.putObjectRows('data', arr, keys);
}

function getKeys(obj) {
  var acc = [];
  for(var k in obj) {
    acc.push(k);
  }
  return acc;
}

