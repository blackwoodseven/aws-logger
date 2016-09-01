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
    currentEnvironment: null, disableLogging: false
  }
}
// grab the configuration from the global state
module.exports = hasAwsLogger ?
                global[AWS_LOGGER_STATE_KEY]
                : initializeGlobalState()
