# aws-logger

Logger object to tag log statements and simplify its parsing.

## Purpose
Ensure that logger.error/warn/log/info output follows our logging convention "[${level}] [${env}] ${log-message}".
This makes the parsing of our log output easier, e.i. when we are trying to extract metrics from the logs.

## General notes on logging levels:
* logger.error:
  * Things we should react to
  * The stack trace will be included
  * **examples**: backend service not available (and no fallback available), request response is unreadable, unhandled errors
* logger.warn:
  * Unexepcted conditions, that may be worth looking into if the amount of them increases.
  * **examples**: attempts to circumvent security, unusual performance behaviors, not reachable backend services (if a fallback is available)
* logger.info == logger.log:
  * Generic explanation of what is going on: no errors, just adding availability to check what happened on the system
  * **examples**: user ${userId} of ${advertiserId} requested a prediction

## Usage
In order to use the logger, first you need to add it to your dependencies with:
```bash
npm install --save git+ssh://git@github.com/blackwoodseven/aws-logger.git#v1.0.0
```
Note that you should specify which version you need by indicating the git tag after the hash. Once installed, the usage is quite simple:
```js
const logger = require('aws-logger')

//on some point, you should specify in which environment you are
//if you use the aws-logger-decorator, you can avoid this step
logger.setEnvironment('test')

exports.someMethod = function(data) {
  logger.info('initializing someMethod call with data', data)

  if (data.error) {
    logger.error('data comes with error', data.error)
  }
}
```
You can also mute the logger statement by calling `logger.disableLogging()`. It is really useful to maintain unit test reports clean.

## Complements
There is the [lambda-decorator-aws-logger](https://github.com/blackwoodseven/lambda-decorator-aws-logger), that will take care of initializing the logger to the correct environment when using it on AWS Lambda functions
