/* Run with mocha */
/* global require, describe, it */
let assert = require('assert');
let gridModule = require('../../src/terminal/grid');
let terminalGridModule = require('../../src/terminal/terminal_grid_view');
let cursorModule = require('../../src/terminal/cursor');
let inputControllerModule = require('../../src/terminal/terminal_input_controller');
let inputDelegateModule = require('../../src/terminal/input_delegate');

describe('TerminalInputController', function() {
  it('can be created', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    let controller = new inputControllerModule.TerminalInputController(cursor);
  });
});
