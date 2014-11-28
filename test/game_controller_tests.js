#! /usr/local/bin/node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../bin/grid.js');
var terminalGridModule = require('../bin/terminal_grid_view.js');
var gameControllerModule = require('../bin/game_controller.js');

describe('GameController', function(){
  it('can be created', function(){
    var controller = new gameControllerModule.GameController();
  });
});
