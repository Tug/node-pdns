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
var pdns = require('pdns');
pdns.init({db: "powerdns", user: "root", password: "mysqlpass"}, function(err) {
  pdns.domains.list(function(err, domains) { });
  pdns.domains.add({name: "test.com", function(err, res) { });
  pdns.domains.remove({name: "test.com", function(err, res) { });
  
  pdns.records.list("test.com", function(err, records) { });
  pdns.domains.add("test.com", {name: "ns1", type: "NS", content:"10.1.0.1"}, function(err, res) { });
  pdns.domains.add("test.com", {name: "ns1"}, function(err, res) { });
});
```


## License

Written by Tugdual de Kerviler, licensed under the MIT license.

