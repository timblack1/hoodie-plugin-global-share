var assert = require('chai').assert;
var mocha = require('mocha');
var suite = mocha.suite;
var test = mocha.test;

suite('example', function () {

  test('test one', function (done) {
      assert.ok(true, 'everything is OK!');
      done();
  });

  test('test two', function (done) {
      assert.ok(true, 'everything is still OK!');
      done();
  });

});
