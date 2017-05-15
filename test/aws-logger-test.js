const expect = require('chai').expect,
  rewire = require('rewire'),
  awsLogger = rewire('../index');

describe('AWS Logger', function () {
  const TEST_ENV = "unit-test-env"
  const LOG_OBJ = { some: 'object' }
  /*
   * prepare console spy
   */
  var fakeGlobalConsole;
  beforeEach(() => {
    process.env.disableVerboseLogging = false

    fakeGlobalConsole = {
      trace: function () {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'trace';
      },
      log: function () {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'log';
      },
      warn: function () {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'warn';
      },
      info: function () {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'info';
      },
      error: function () {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'error';
      }
    }
    awsLogger.__set__('console', fakeGlobalConsole)
  })

  afterEach(() => {
    awsLogger.__set__('console', console)
  })

  context('when logging to awsLogger.error', () => {
    context('when object is not an error', () => {
      beforeEach(() => {
        awsLogger.error(LOG_OBJ)
      })

      it('logs the object', () => {
        expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
      })

      it('tags the log output with [Error]', () => {
        expect(fakeGlobalConsole.lastArguments).to.contain("[Error]")
      })
    })

    context('when object is an error', () => {
      var thrownError;

      beforeEach(() => {
        try {
          throw new Error('hi')
        } catch (err) {
          thrownError = err
          awsLogger.error(LOG_OBJ, err)
        }
      })

      it('logs the error including the stacktrace', () => {
        expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
        expect(fakeGlobalConsole.lastArguments[2]).to.contain(thrownError.stack)
      })

      it('tags the log output with [Error]', () => {
        expect(fakeGlobalConsole.lastArguments).to.contain("[Error]")

      })
    })
  })

  context('when logging to awsLogger.warn', () => {
    beforeEach(() => {
      awsLogger.warn(LOG_OBJ)
    })

    it('logs the object', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
    })

    it('tags the log output with [Warn]', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain("[Warn]")

    })
  })

  context('when logging to awsLogger.info', () => {
    beforeEach(() => {
      awsLogger.info(LOG_OBJ)
    })

    it('logs the object', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
    })

    it('tags the log output with [Info]', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain("[Info]")

    })
  })

  context('when logging to awsLogger.log', () => {
    beforeEach(() => {
      awsLogger.log(LOG_OBJ)
    })

    it('logs the object', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
    })

    it('tags the log output with [Info]', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain("[Info]")

    })
  })

  context('when logging to awsLogger.debug', () => {
    beforeEach(() => {
      awsLogger.debug(LOG_OBJ)
    })

    it('logs the object', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
    })

    it('tags the log output with [Debug]', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain("[Debug]")

    })
  })

  context('when verbose logging is disabled', () => {
    beforeEach(() => {
      process.env.disableVerboseLogging = true
      awsLogger.debug(LOG_OBJ)
    })

    it('should suppress debug logging', () => {
      expect(fakeGlobalConsole.lastArguments).not.to.exist
    })
  })
})
