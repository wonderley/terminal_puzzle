/* Run with mocha */
/* global require, describe, it */
const assert = require('assert');
const gravityControllerModule = require('../../src/terminal/gravity_controller.js');
const terminalGridModule = require('../../src/terminal/terminal_grid_view.js');
const Grid = require('../../src/terminal/grid').Grid;
const TileState = require('../../src/terminal/tile').TileState;

describe('GravityController', function() {
  it('can be created', function() {
    let grid = new Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let controller = new gravityControllerModule.GravityController(grid, view);
  });
});

describe('GravityController applyGravity', function() {
  it('drops single tiles with empty tiles below them to the bottom', function() {
    let grid = new Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let controller = new gravityControllerModule.GravityController(grid, view);
    let tile1 = grid.tileAt(2, 2);
    let tile2 = grid.tileAt(3, 3);
    let tile3 = grid.tileAt(4, 4);
    let tile4 = grid.tileAt(5, 5);
    tile1.state = TileState.A;
    tile2.state = TileState.B;
    tile3.state = TileState.C;
    tile4.state = TileState.D;
    controller.applyGravity();
    assert(grid.tileAt(2, Grid.ROW_COUNT - 1) === tile1);
    assert(grid.tileAt(2, 2).state === TileState.EMPTY);
    assert(grid.tileAt(3, Grid.ROW_COUNT - 1) === tile2);
    assert(grid.tileAt(3, 3).state === TileState.EMPTY);
    assert(grid.tileAt(4, Grid.ROW_COUNT - 1) === tile3);
    assert(grid.tileAt(4, 4).state === TileState.EMPTY);
    assert(grid.tileAt(5, Grid.ROW_COUNT - 1) === tile4);
    assert(grid.tileAt(5, 5).state === TileState.EMPTY);
  });
  it('drops tiles in same column to the bottom', function() {
    let grid = new Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let controller = new gravityControllerModule.GravityController(grid, view);
    let tile1 = grid.tileAt(2, 2);
    let tile2 = grid.tileAt(2, 3);
    tile1.state = TileState.A;
    tile2.state = TileState.B;
    controller.applyGravity();
    assert(grid.tileAt(2, Grid.ROW_COUNT - 2) === tile1);
    assert(grid.tileAt(2, 2).state === TileState.EMPTY);
    assert(grid.tileAt(2, Grid.ROW_COUNT - 1) === tile2);
    assert(grid.tileAt(2, 3).state === TileState.EMPTY);
  });
  it('drops tiles in same column with space between them to the bottom', function() {
    let grid = new Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let controller = new gravityControllerModule.GravityController(grid, view);
    let tile1 = grid.tileAt(4, 3);
    let tile2 = grid.tileAt(4, 6);
    tile1.state = TileState.C;
    tile2.state = TileState.D;
    controller.applyGravity();
    assert(grid.tileAt(4, Grid.ROW_COUNT - 2) === tile1);
    assert(grid.tileAt(4, 3).state === TileState.EMPTY);
    assert(grid.tileAt(4, Grid.ROW_COUNT - 1) === tile2);
    assert(grid.tileAt(4, 6).state === TileState.EMPTY);
  });
});
