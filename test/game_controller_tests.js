#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var GameController = require('../src/game_controller.js');
var gridDelegateModule = require('../src/grid_delegate.js');

describe('GameController', function(){
  it('can be created', function(){
    var controller = new GameController();
  });
  it('is a GridDelegate', function(){
    var controller = new GameController();
    assert(gridDelegateModule.isGridDelegate(controller));
  });
});
