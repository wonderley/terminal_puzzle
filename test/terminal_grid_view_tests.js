#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../src/grid.js');
var terminalGridModule = require('../src/terminal_grid_view.js');
var cursorModule = require('../src/cursor.js');
var inputDelegateModule = require('../src/input_delegate.js');

describe('TerminalGridView', function(){
  it('can be created', function(){
    var gridMC = new gridModule.Grid();
    var terminalGrid = new terminalGridModule.TerminalGridView(gridMC);
  });
});

describe('TerminalGridView drawCursorAt', function(){
  it('can draw a Cursor', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    assert(view.drawCursorAt !== undefined);
  });
});

describe('TerminalGridView clearCursorAt', function(){
  it('can clear a Cursor', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    assert(view.clearCursorAt !== undefined);
  });
});
