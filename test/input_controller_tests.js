#! /usr/local/bin/node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../bin/grid.js');
var terminalGridModule = require('../bin/terminal_grid_view.js');
var cursorModule = require('../bin/cursor.js');
var inputControllerModule = require('../bin/input_controller.js');

describe('InputController', function(){
  it('can be created', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    var controller = new inputControllerModule.InputController(cursor);
  });
});

describe('InputController', function(){
  it('throws if created with invalid cursor', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    var tmp = cursorModule.isValidCursor;
    cursorModule.isValidCursor = function(){
      return false;
    };
    var threw = false;
    try{
      var controller = new inputControllerModule.InputController(cursor);
    }catch(e){
      threw = true;
    } finally {
      cursorModule.isValidCursor = tmp;
      assert(threw);
    }
  });
});