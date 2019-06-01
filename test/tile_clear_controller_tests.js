#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
const assert = require('assert');
const tileClearControllerModule = require('../src/tile_clear_controller.js');
const Grid = require('../src/grid.js').Grid;
const TileState = require('../src/tile.js').TileState;

describe('TileClearController', function() {
  it('can be created', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
  });
});

describe('TileClearController markTilesToClear', function() {
  it('marks three consecutive tiles in same row with same non-empty state', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let someRow = Grid.ROW_COUNT - 2;
    let tile1 = grid.tileAt(2, someRow);
    let tile2 = grid.tileAt(3, someRow);
    let tile3 = grid.tileAt(4, someRow);
    tile1.state = TileState.A;
    tile2.state = TileState.A;
    tile3.state = TileState.A;
    controller.markTilesToClear();
    assert(tile1.markedToClear && tile2.markedToClear && tile3.markedToClear);
  });
  it('doesn\'t mark three consecutive tiles in bottom row with same non-empty state', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let bottomY = Grid.ROW_COUNT - 1;
    let tile1 = grid.tileAt(2, bottomY);
    let tile2 = grid.tileAt(3, bottomY);
    let tile3 = grid.tileAt(4, bottomY);
    tile1.state = TileState.A;
    tile2.state = TileState.A;
    tile3.state = TileState.A;
    controller.markTilesToClear();
    assert(!tile1.markedToClear && !tile2.markedToClear && !tile3.markedToClear);
  });
  it('does not mark three consecutive tiles in same row with different non-empty state', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let someRow = Grid.ROW_COUNT - 2;
    let tile1 = grid.tileAt(2, someRow);
    let tile2 = grid.tileAt(3, someRow);
    let tile3 = grid.tileAt(4, someRow);
    tile1.state = TileState.A;
    tile2.state = TileState.B;
    tile3.state = TileState.A;
    controller.markTilesToClear();
    assert(!tile1.markedToClear && !tile2.markedToClear && !tile3.markedToClear);
  });
  it('marks all tiles if two sets of consecutive tiles are in the same row', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let someRow = Grid.ROW_COUNT - 2;
    let tile1 = grid.tileAt(0, someRow);
    let tile2 = grid.tileAt(1, someRow);
    let tile3 = grid.tileAt(2, someRow);
    let tile4 = grid.tileAt(3, someRow);
    let tile5 = grid.tileAt(4, someRow);
    let tile6 = grid.tileAt(5, someRow);
    tile1.state = TileState.C;
    tile2.state = TileState.C;
    tile3.state = TileState.C;
    tile4.state = TileState.D;
    tile5.state = TileState.D;
    tile6.state = TileState.D;
    controller.markTilesToClear();
    assert(tile1.markedToClear); 
    assert(tile2.markedToClear); 
    assert(tile3.markedToClear);
    assert(tile4.markedToClear);
    assert(tile5.markedToClear);
    assert(tile6.markedToClear);
  });
  it('does not mark consecutive empty tiles', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let bottomY = Grid.ROW_COUNT - 1;
    let tile1 = grid.tileAt(0, bottomY);
    let tile2 = grid.tileAt(1, bottomY);
    let tile3 = grid.tileAt(2, bottomY);
    let tile4 = grid.tileAt(3, bottomY);
    let tile5 = grid.tileAt(4, bottomY);
    let tile6 = grid.tileAt(5, bottomY);
    controller.markTilesToClear();
    assert(!tile1.markedToClear); 
    assert(!tile2.markedToClear); 
    assert(!tile3.markedToClear);
    assert(!tile4.markedToClear);
    assert(!tile5.markedToClear);
    assert(!tile6.markedToClear);
  });
  it('marks three consecutive tiles in same column with same non-empty state', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let rightX = Grid.COLUMN_COUNT - 1;
    let tile1 = grid.tileAt(rightX, 2);
    let tile2 = grid.tileAt(rightX, 3);
    let tile3 = grid.tileAt(rightX, 4);
    tile1.state = TileState.A;
    tile2.state = TileState.A;
    tile3.state = TileState.A;
    controller.markTilesToClear();
    assert(tile1.markedToClear && tile2.markedToClear && tile3.markedToClear);
  });
  it('does not mark three consecutive tiles in same column with different non-empty state', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let rightX = Grid.COLUMN_COUNT - 1;
    let tile1 = grid.tileAt(rightX, 2);
    let tile2 = grid.tileAt(rightX, 3);
    let tile3 = grid.tileAt(rightX, 4);
    tile1.state = TileState.A;
    tile2.state = TileState.B;
    tile3.state = TileState.A;
    controller.markTilesToClear();
    assert(!tile1.markedToClear && !tile2.markedToClear && !tile3.markedToClear);
  });
  it('marks all tiles if two sets of consecutive tiles are in the same column', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let rightX = Grid.COLUMN_COUNT - 1;
    let tile1 = grid.tileAt(rightX, 0);
    let tile2 = grid.tileAt(rightX, 1);
    let tile3 = grid.tileAt(rightX, 2);
    let tile4 = grid.tileAt(rightX, 3);
    let tile5 = grid.tileAt(rightX, 4);
    let tile6 = grid.tileAt(rightX, 5);
    tile1.state = TileState.C;
    tile2.state = TileState.C;
    tile3.state = TileState.C;
    tile4.state = TileState.D;
    tile5.state = TileState.D;
    tile6.state = TileState.D;
    controller.markTilesToClear();
    assert(tile1.markedToClear); 
    assert(tile2.markedToClear); 
    assert(tile3.markedToClear);
    assert(tile4.markedToClear);
    assert(tile5.markedToClear);
    assert(tile6.markedToClear);
  });
  it('allows tiles to be shared vertically and horizontally', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let tile1 = grid.tileAt(0, Grid.ROW_COUNT - 2);
    let tile2 = grid.tileAt(1, Grid.ROW_COUNT - 2);
    let tile3 = grid.tileAt(2, Grid.ROW_COUNT - 2);
    let tile4 = grid.tileAt(1, Grid.ROW_COUNT - 3);
    let tile5 = grid.tileAt(1, Grid.ROW_COUNT - 4);
    tile1.state = TileState.C;
    tile2.state = TileState.C;
    tile3.state = TileState.C;
    tile4.state = TileState.C;
    tile5.state = TileState.C;
    controller.markTilesToClear();
    assert(tile1.markedToClear); 
    assert(tile2.markedToClear); 
    assert(tile3.markedToClear);
    assert(tile4.markedToClear);
    assert(tile5.markedToClear);
  });
  it('returns true if any tiles are marked to clear', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let someRow = Grid.ROW_COUNT - 2;
    let tile1 = grid.tileAt(2, someRow);
    let tile2 = grid.tileAt(3, someRow);
    let tile3 = grid.tileAt(4, someRow);
    tile1.state = TileState.A;
    tile2.state = TileState.A;
    tile3.state = TileState.A;
    let somethingWasMarked = controller.markTilesToClear();
    assert(somethingWasMarked);
  });
  it('returns false if no tiles are marked to clear', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let bottomY = Grid.ROW_COUNT - 1;
    let tile1 = grid.tileAt(2, bottomY);
    let tile2 = grid.tileAt(3, bottomY);
    let tile3 = grid.tileAt(4, bottomY);
    tile1.state = TileState.A;
    tile2.state = TileState.B;
    tile3.state = TileState.A;
    let somethingWasMarked = controller.markTilesToClear();
    assert(!somethingWasMarked);
  });
});

describe('TileClearController clearMarkedTiles', function() {
  it('sets all marked tiles to empty', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let tile1 = grid.tileAt(2, 0);
    let tile2 = grid.tileAt(2, 1);
    let tile3 = grid.tileAt(2, 2);
    let tile4 = grid.tileAt(1, 0);
    tile1.markedToClear = true;
    tile2.markedToClear = true;
    tile3.markedToClear = true;
    tile4.markedToClear = true;
    tile1.state = TileState.A;
    tile2.state = TileState.B;
    tile3.state = TileState.C;
    tile4.state = TileState.D;
    controller.clearMarkedTiles();
    assert(tile1.state === TileState.EMPTY);
    assert(tile2.state === TileState.EMPTY);
    assert(tile3.state === TileState.EMPTY);
    assert(tile4.state === TileState.EMPTY);
  });
  it('unmarks all marked tiles', function() {
    let grid = new Grid();
    let controller = new tileClearControllerModule.TileClearController(grid);
    let tile1 = grid.tileAt(2, 0);
    let tile2 = grid.tileAt(2, 1);
    let tile3 = grid.tileAt(2, 2);
    let tile4 = grid.tileAt(1, 0);
    tile1.markedToClear = true;
    tile2.markedToClear = true;
    tile3.markedToClear = true;
    tile4.markedToClear = true;
    tile1.state = TileState.A;
    tile2.state = TileState.B;
    tile3.state = TileState.C;
    tile4.state = TileState.D;
    controller.clearMarkedTiles();
    assert(tile1.markedToClear === false);
    assert(tile2.markedToClear === false);
    assert(tile3.markedToClear === false);
    assert(tile4.markedToClear === false);
  });
});
