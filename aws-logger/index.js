/*
  # Purpose
    Overrides console.error/warn/log so they output follows our logging convention "[${level}] [${env}] ${log-message}".
    This makes the parsing of our log output easier, e.i. when we are trying to extract metrics from the logs.

  # General notes on logging levels:
  console.error:
    * Things we should react to:
      -> examples: backend service not available (and no fallback available), request response is unreadable, unhandled errors
    * They should include stack trace (if possible)
  console.warn:
    * Unexepcted conditions, that may be worth looking into if the amount of them increases.
      -> examples: attempts to circumvent security, unusual performance behaviors, not reachable backend services (if a fallback is available)
    * They do not provide stack trace
  console.info == console.log:
    * Generic explanation of what is going on: no errors, just adding availability to check what happened on the system
      -> example: user ${userId} of ${advertiserId} requested a prediction
    * They do not provide stack trace

*/

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
