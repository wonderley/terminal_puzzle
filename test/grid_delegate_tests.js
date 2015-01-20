#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridDelegate = require('../bin/grid_delegate.js');

describe('A GridDelegate', function(){
  it('is something that implements the onGridChanged function', function(){
    var obj = {};
    assert(gridDelegate.isGridDelegate(obj) === false);
    obj.onGridChanged = 5;
    assert(gridDelegate.isGridDelegate(obj) === false);
    obj.onGridChanged = {};
    assert(gridDelegate.isGridDelegate(obj) === false);
    obj.onGridChanged = true;
    assert(gridDelegate.isGridDelegate(obj) === false);
    obj.onGridChanged = function(){};
    assert(gridDelegate.isGridDelegate(obj) === true);
  });
});