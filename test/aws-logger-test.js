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
    fakeGlobalConsole = {
      trace: function() {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'trace';
      },
      log: function() {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'log';
      },
      warn: function() {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'warn';
      },
      info: function() {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'info';
      },
      error: function() {
        fakeGlobalConsole.lastArguments = Array.from(arguments);
        fakeGlobalConsole.lastMethod = 'error';
      }
    }
    awsLogger.__set__('console', fakeGlobalConsole)
  })

  afterEach(() => {
    awsLogger.__set__('console', console)
  })

  beforeEach(() => {
    awsLogger.setEnvironment(TEST_ENV)
  })

  afterEach(() => {
    awsLogger.setEnvironment(null)
  })

  context('when logging to awsLogger.error', () => {
    beforeEach(() => {
      awsLogger.error(LOG_OBJ)
    })

    it('logs the object', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
    })

    it('tags the log output with [Error] and "[{Envionment}]"', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain("[Error]")
      expect(fakeGlobalConsole.lastArguments).to.contain(`[${TEST_ENV}]`)
    })

    it('Uses the trace method to ensure stack trace on AWS logs', () => {
      expect(fakeGlobalConsole.lastMethod).to.equal('trace')
    })
  })

  context('when logging to awsLogger.warn', () => {
    beforeEach(() => {
      awsLogger.warn(LOG_OBJ)
    })

    it('logs the object', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
    })

    it('tags the log output with [Warn] and "[{Envionment}]"', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain("[Warn]")
      expect(fakeGlobalConsole.lastArguments).to.contain(`[${TEST_ENV}]`)
    })
  })

  context('when logging to awsLogger.info', () => {
    beforeEach(() => {
      awsLogger.info(LOG_OBJ)
    })

    it('logs the object', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
    })

    it('tags the log output with [Info] and "[{Envionment}]"', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain("[Info]")
      expect(fakeGlobalConsole.lastArguments).to.contain(`[${TEST_ENV}]`)
    })
  })

  context('when logging to awsLogger.log', () => {
    beforeEach(() => {
      awsLogger.log(LOG_OBJ)
    })

    it('logs the object', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain(LOG_OBJ)
    })

    it('tags the log output with [Info] and "[{Envionment}]"', () => {
      expect(fakeGlobalConsole.lastArguments).to.contain("[Info]")
      expect(fakeGlobalConsole.lastArguments).to.contain(`[${TEST_ENV}]`)
    })
  })
})
