#! /usr/local/bin/node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gameControllerModule = require('../bin/game_controller.js');
var gridDelegateModule = require('../bin/grid_delegate.js');

describe('GameController', function(){
  it('can be created', function(){
    var controller = new gameControllerModule.GameController();
  });
  it('is a GridDelegate', function(){
    var controller = new gameControllerModule.GameController();
    assert(gridDelegateModule.isGridDelegate(controller));
  });
});
