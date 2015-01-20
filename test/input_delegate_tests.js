#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var inputDelegate = require('../bin/input_delegate.js');

describe('An InputDelegate', function(){
  it('is something that implements the onUserInput function and has the isLocked flag', function(){
    var obj = {};
    assert(inputDelegate.isInputDelegate(obj) === false);
    obj.onUserInput = 5;
    assert(inputDelegate.isInputDelegate(obj) === false);
    obj.onUserInput = {};
    assert(inputDelegate.isInputDelegate(obj) === false);
    obj.onUserInput = true;
    assert(inputDelegate.isInputDelegate(obj) === false);
    obj.onUserInput = function(){};
    obj.isLocked = true;
    assert(inputDelegate.isInputDelegate(obj) === true);
    var obj2 = { isLocked : true };
    assert(inputDelegate.isInputDelegate(obj2) === false);
  });
});