var currentEnvrionment = null;
var disableLogging = false;

const concatToArguments = (logLevel, args) => {
  if (currentEnvrionment == null) {
    console.warn('[Warn] Missing environment for logging, please call setEnvironment before using the aws-logger.')
  }
  return [`[${logLevel}]`, `[${currentEnvrionment}]`].concat(Array.from(args));
}

const createLoggerFn = (logLevel, method) => function() {
  return disableLogging || console[method].apply(console, concatToArguments(logLevel,arguments))
}

module.exports = {
  setEnvironment: (env) => currentEnvrionment = env,
  disableLogging: () => { disableLogging = true },
  log: createLoggerFn('Info','log'),
  info: createLoggerFn('Info','info'),
  warn: createLoggerFn('Warn','warn'),
  error: createLoggerFn('Error','trace')
}
