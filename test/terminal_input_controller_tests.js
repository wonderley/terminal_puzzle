#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../src/grid.js');
var terminalGridModule = require('../src/terminal_grid_view.js');
var cursorModule = require('../src/cursor.js');
var inputControllerModule = require('../src/terminal_input_controller.js');
var inputDelegateModule = require('../src/input_delegate.js');

describe('TerminalInputController', function(){
  it('can be created', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    var controller = new inputControllerModule.TerminalInputController(cursor);
  });
});
