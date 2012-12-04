var assert = require('assert');
var util = require('../lib/util');
var dateFormat = require('dateformat');


assert.equal(util.checkDomainName("domain.tld"), true);
assert.equal(util.checkDomainName("www.domain.tld"), true);
assert.equal(util.checkDomainName("domain"), false);
assert.equal(util.checkDomainName("www..tld"), false);
assert.equal(util.checkDomainName(".domain.tld"), false);
assert.equal(util.checkDomainName("domain.tld."), false);
assert.equal(util.checkDomainName("domain.."), false);

assert.equal(util.trim("   hello world   "), "hello world");

assert.equal(util.checkString("hello world"), true);
assert.equal(util.checkString(""), false);
assert.equal(util.checkString(0), false);

assert.equal(util.soaSerial(), dateFormat(new Date(), "yyyymmdd")+'01');
assert.equal(util.soaSerial(dateFormat(new Date(), "yyyymmdd")+'01'), dateFormat(new Date(), "yyyymmdd")+'02');
assert.equal(util.soaSerial(dateFormat(new Date(), "yyyymmdd")+'02'), dateFormat(new Date(), "yyyymmdd")+'03');

assert.equal(util.updateSoa("ns.domain.tld admin@domain.tld 1970010101 10800 7200 604800 10800"),
                            "ns.domain.tld admin@domain.tld "+dateFormat(new Date(), "yyyymmdd")+'01'+" 10800 7200 604800 10800");
assert.equal(util.updateSoa("ns.domain.tld admin@domain.tld "+dateFormat(new Date(), "yyyymmdd")+'01'+" 10800 7200 604800 10800"),
                            "ns.domain.tld admin@domain.tld "+dateFormat(new Date(), "yyyymmdd")+'02'+" 10800 7200 604800 10800");

