var util = require('util'),
winston = require('winston'),
Syslog = require('node-syslog');

var levels = Object.keys({
  debug: Syslog.LOG_DEBUG, 
  info: Syslog.LOG_INFO, 
  notice: Syslog.LOG_NOTICE, 
  warning: Syslog.LOG_WARNING,
  error: Syslog.LOG_ERR, 
  crit: Syslog.LOG_CRIT,
  alert: Syslog.LOG_ALERT,
  emerg: Syslog.LOG_EMERG
});

var SyslogNative = exports.SyslogNative = winston.transports.SyslogNative = function (options) {
  options = options || {};

  this.name = options.name || process.title;
  this.flags = options.flags ? options.flags : Syslog.LOG_ODELAY;
  this.facility = options.facility ? options.facility : Syslog.LOG_LOCAL0;
  this.cee = options.cee;
  
  this.name = 'SyslogNative';

  Syslog.init(this.name, this.flags, this.facility);
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(SyslogNative, winston.Transport);

SyslogNative.prototype.log = function (level, msg, meta, callback) {
  var data = meta ? winston.clone(meta) : {}, 
  messageStr = '',
  syslogLevel = typeof(levels[level]) === 'number' ? levels[level] : -1;

  if (syslogLevel < 0) {
    callback(new Error('invalid level: ' + level));
  } else {
    if (msg && msg.length > 0) {
      data.message = msg;
    }

    if (this.cee) {
      messageStr += '@cee:';
    }

    messageStr += JSON.stringify(data);

    Syslog.log(sysogLevel, messageStr);
    
    callback(null, true);
  }
};

SyslogNative.prototype.connect = function () {
};
