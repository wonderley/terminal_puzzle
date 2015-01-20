#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../bin/grid.js');
var terminalGridModule = require('../bin/terminal_grid_view.js');
var cursorModule = require('../bin/cursor.js');
var inputControllerModule = require('../bin/terminal_input_controller.js');
var inputDelegateModule = require('../bin/input_delegate.js');

describe('TerminalInputController', function(){
  it('can be created', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    var controller = new inputControllerModule.TerminalInputController(cursor);
  });
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
      var controller = new inputControllerModule.TerminalInputController(cursor);
    }catch(e){
      threw = true;
    } finally {
      cursorModule.isValidCursor = tmp;
      assert(threw);
    }
  });
  it('is an InputDelegate', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    var controller = new inputControllerModule.TerminalInputController(cursor);
    assert(inputDelegateModule.isInputDelegate(controller) === true);
  });
});
