#! /usr/local/bin/node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var inputDelegate = require('../bin/input_delegate.js');

describe('An InputDelegate', function(){
  it('is something that implements the onUserInput function', function(){
    var obj = {};
    assert(inputDelegate.isInputDelegate(obj) === false);
    obj.onUserInput = 5;
    assert(inputDelegate.isInputDelegate(obj) === false);
    obj.onUserInput = {};
    assert(inputDelegate.isInputDelegate(obj) === false);
    obj.onUserInput = true;
    assert(inputDelegate.isInputDelegate(obj) === false);
    obj.onUserInput = function(){};
    assert(inputDelegate.isInputDelegate(obj) === true);
  });
});