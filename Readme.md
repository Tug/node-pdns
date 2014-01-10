# node-pdns

CLI for PowerDNS

## Intallation

    sudo npm install -g pdns


## Configure for MySQL

Create database "powerdns" in MySQL

    sudo pdns config set db powerdns
    sudo pdns config set user <mysqluser>
    sudo pdns config set password <mysqlpass>

To connect on a remote MySQL server you can also set the host (default is "localhost:3306"):

    sudo pdns config set host <host>

## Usage

    $ pdns -h
    
    help:    domains [list|add|remove]
    help:    domains list [<name> [<type> [<ttl> [<created_at>]]]] : List all domains matching the parameters
    help:    domains add <domain.tld> [<type> [<ttl>]] [--soa [<soa_content>]] [--mx [<mx_content>]] [--ns [<ns_content>]] : Add a new domain
    help:    	 --soa : Generate a default SOA record
    help:    	 --soa=<soa_content> : Generate a SOA record using <soa_content>
    help:    	 --mx : Generate a default MX record
    help:    	 --mx=<mx_content> : Generate an MX record using <mx_content>
    help:    	 --ns : Generate a default NS record
    help:    	 --ns=<ns_content> : Generate an NS record using <ns_content>
    help:    domains remove <name> [<type> [<ttl> [<created_at> [updated_at]]]] : Remove all domains matching the parameters
    help:    
    help:    records [list|add|remove] [--domain|-d]
    help:    records list [<name> [<type> [<content>]]] -d=<domain.tld> : List all records for domain_name matching the parameters
    help:    records add <name> <type> <content> [<ttl>] -d=<domain.tld> : Add a new record for <domain.tld>
    help:    records remove <name> [<type> [<content> [<ttl>]]] -d=<domain.tld> : Remove all records for <domain.tld> matching the parameters
    help:    
    help:    Options:
    help:      --domain, -d  Domain to use for the records command                                   [string]
    help:      --ns          NameServer address when adding a new domain, default is "ns1.<domain.tld>"                                                       
    help:      --soa         Start of autority when adding a new domain, default is "ns1.<domain.tld> admin@<domain.tld> <YYYYMMDD>01 10800 7200 604800 10800"
    help:      --mx          SMTP server when adding a new domain, default is "mail.<domain.tld>"


## Use adapter directly

``` js
var config = {
  adapter: "mysql",
  db: "powerdns_development",
  user: "root",
  password: "mysqlpass"
};
var pdns = require('pdns')(config);

pdns.domains.list({}, {}, function(err, domains) {...});
pdns.domains.add({name: "test.com"}, {soa:true, mx:true, ns:true}, function(err, res) {...});
pdns.domains.remove({name: "test.com"}, {}, function(err, res) {...});

pdns.records.list("test.com", {}, {}, function(err, records) {...});
pdns.records.add("test.com", {name: "ns2", type: "A", content:"10.1.0.1"}, {}, function(err, res) {...});
pdns.records.remove("test.com", {name: "ns2"}, {}, function(err, res) {...});
```


## License

MIT license.

