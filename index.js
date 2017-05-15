const config = require('./singleton-configuration');
const concatToArguments = (logLevel, args) => {
  return [`[${logLevel}]`].concat(Array.from(args));
}

const createLoggerFn = (logLevel, method) => function () {
  return config.disableLogging || console[method].apply(console, concatToArguments(logLevel, arguments))
}

const customErrorFn = (logger) => function () {
  // Expands the error to include the stack trace for Error objects. NodeJS 6 has this feature on console.error, but 4.2 not.
  var args = Array.from(arguments).map(x => x instanceof Error ? x.stack : x)
  return logger.apply(this, args);
}

const debugLog = createLoggerFn('Debug', 'log')

module.exports = {
  disableLogging: () => { config.disableLogging = true },
  log: createLoggerFn('Info', 'log'),
  info: createLoggerFn('Info', 'info'),
  warn: createLoggerFn('Warn', 'warn'),
  error: customErrorFn(createLoggerFn('Error', 'error')),
  debug: function () {
    const disableVerboseLogging = process.env.disableVerboseLogging === true || process.env.disableVerboseLogging == 'true'
    if (!disableVerboseLogging) {
      debugLog.apply(this, arguments)
    }
  }
}
