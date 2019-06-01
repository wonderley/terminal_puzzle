#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
let assert = require('assert');
let gridModule = require('../src/grid.js');
let terminalGridModule = require('../src/terminal_grid_view.js');
let cursorModule = require('../src/cursor.js');
let inputControllerModule = require('../src/terminal_input_controller.js');
let inputDelegateModule = require('../src/input_delegate.js');

describe('TerminalInputController', function() {
  it('can be created', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    let controller = new inputControllerModule.TerminalInputController(cursor);
  });
});
