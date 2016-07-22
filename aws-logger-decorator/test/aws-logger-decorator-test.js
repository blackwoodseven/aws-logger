const expect = require('chai').expect,
  rewire = require('rewire'),
  decorator = rewire('../../../src/decorators/aws-logger-decorator');

const originalLogger = decorator.__get__('awsLogger');

describe('Aws logger decorator', () => {
  var env = null;

  beforeEach(() => {
    decorator.__set__('awsLogger', {
      setEnvironment: (_env) => env = _env
    })
  })

  afterEach(() => {
    decorator.__set__('awsLogger', originalLogger)
  })

  it('should setup the environment of the logger before calling the handler', (done) => {
    const handler = (event, context, callback) => {
      callback(null, env)
    }
    decorator(handler)({},{ environment: 'test' }, (err, data) => {
      expect(data).to.equal('test')
      done();
    })
  })
})
