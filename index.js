// Create a unique symbol, so we can survive multiple instances
// of different versions due npm subdependencies
// More information on:
// https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
const AWS_LOGGER_STATE_KEY = Symbol.for('com.blackwoodseven.aws-logger')

//Check if logger has been initialized before
var globalSymbols = Object.getOwnPropertySymbols(global);
var hasAwsLogger = globalSymbols.indexOf(AWS_LOGGER_STATE_KEY) > -1;

const initializeGlobalState = () => {
  return global[AWS_LOGGER_STATE_KEY] = {
    currentEnvrionment: null, disableLogging: false
  }
}
// grab the configuration from the global state
const state = hasAwsLogger ?
                global[AWS_LOGGER_STATE_KEY]
                : initializeGlobalState()

const concatToArguments = (logLevel, args) => {
  if (state.currentEnvrionment == null) {
    console.warn('[Warn] Missing environment for logging, please call setEnvironment before using the aws-logger.')
  }
  return [`[${logLevel}]`, `[${state.currentEnvrionment}]`].concat(Array.from(args));
}

const createLoggerFn = (logLevel, method) => function() {
  return state.disableLogging || console[method].apply(console, concatToArguments(logLevel,arguments))
}

module.exports = {
  setEnvironment: (env) => state.currentEnvrionment = env,
  disableLogging: () => { state.disableLogging = true },
  log: createLoggerFn('Info','log'),
  info: createLoggerFn('Info','info'),
  warn: createLoggerFn('Warn','warn'),
  error: createLoggerFn('Error','trace')
}
