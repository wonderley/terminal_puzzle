#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
let assert = require('assert');
let gridModule = require('../../src/terminal/grid.js');
let terminalGridModule = require('../../src/terminal/terminal_grid_view.js');
let cursorModule = require('../../src/terminal/cursor.js');
let inputDelegateModule = require('../../src/terminal/input_delegate.js');

describe('TerminalGridView', function() {
  it('can be created', function() {
    let gridMC = new gridModule.Grid();
    let terminalGrid = new terminalGridModule.TerminalGridView(gridMC);
  });
});

describe('TerminalGridView drawCursorAt', function() {
  it('can draw a Cursor', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    assert(view.drawCursorAt !== undefined);
  });
});

describe('TerminalGridView clearCursorAt', function() {
  it('can clear a Cursor', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    assert(view.clearCursorAt !== undefined);
  });
});
