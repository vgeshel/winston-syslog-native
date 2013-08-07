/*
 * syslog-test.js: Tests for instances of the SyslogNative transport
 *
 * (C) Vadim Geshel
 * MIT LICENSE
 *
 * Compied from winston-syslog,
 * (C) 2010 Charlie Robbins
 *
 */

var path = require('path'),
vows = require('vows'),
assert = require('assert'),
winston = require('winston'),
helpers = require('winston/test/helpers'),
SyslogNative = require('../lib/winston-syslog-native').SyslogNative;

function assertSyslog (transport) {
  assert.instanceOf(transport, SyslogNative);
  assert.isFunction(transport.log);
  assert.isFunction(transport.connect);
};

function closeTopic(){
  var transport = new winston.transports.SyslogNative();
  // var logger = new winston.Logger({
  //   transports: [transport]
  // });
  // logger.log('debug', 'Test message');
  return transport;
}

var transport = new SyslogNative();

vows.describe('winston-syslog-native').addBatch({
  "An instance of the Syslog Transport": {
    "should have the proper methods defined": function () {
      console.error('running');
      assertSyslog(transport);
    },
    "the log() method": helpers.testSyslogLevels(transport, "should log messages to syslogd", function (ign, err, ok) {
      assert.isTrue(!err);
      assert.isTrue(ok);
    }),
    topic : closeTopic
  }
}).export(module);

