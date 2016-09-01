const config = require('./singleton-configuration');

const concatToArguments = (logLevel, args) => {
  if (config.currentEnvironment == null) {
    console.warn('[Warn] Missing environment for logging, please call setEnvironment before using the aws-logger.')
  }
  return [`[${logLevel}]`, `[${config.currentEnvironment}]`].concat(Array.from(args));
}

const createLoggerFn = (logLevel, method) => function() {
  return config.disableLogging || console[method].apply(console, concatToArguments(logLevel,arguments))
}

const debugLog = createLoggerFn('Debug','log')

module.exports = {
  setEnvironment: (env) => config.currentEnvironment = env,
  disableLogging: () => { config.disableLogging = true },
  log: createLoggerFn('Info','log'),
  info: createLoggerFn('Info','info'),
  warn: createLoggerFn('Warn','warn'),
  error: createLoggerFn('Error','trace'),
  debug: function() {
    if (config.currentEnvironment !== 'prod') {
      debugLog.apply(this, arguments)
    }
  }
}
