# node-pdns

CLI for PowerDNS

## Intallation

    npm install -g pdns


## Configure

    pdns config set user mysqluser
    pdns config set password mysqlpass


## Usage

    pdns -h


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
pdns.domains.add({name: "test.com"}, {soa:true, mx:true, ns:"10.1.0.1"}, function(err, res) {...});
pdns.domains.remove({name: "test.com"}, {}, function(err, res) {...});

pdns.records.list("test.com", {}, {}, function(err, records) {...});
pdns.records.add("test.com", {name: "ns2", type: "A", content:"10.1.0.1"}, {}, function(err, res) {...});
pdns.records.remove("test.com", {name: "ns2"}, {}, function(err, res) {...});
```


## License

Written by Tugdual de Kerviler, licensed under the MIT license.

