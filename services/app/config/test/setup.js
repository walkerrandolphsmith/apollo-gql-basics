const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

global.sinon = sinon;
global.chai = chai;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.expect = chai.expect;
global.assert = chai.assert;
