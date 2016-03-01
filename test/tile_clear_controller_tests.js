#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var tileClearControllerModule = require('../src/tile_clear_controller.js');
var gridModule = require('../src/grid.js');

describe('TileClearController', function(){
  it('can be created', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
  });
  it('must be created with a valid grid', function(){
    var grid = new gridModule.Grid();
    var tmp = gridModule.isValidGrid;
    gridModule.isValidGrid = function(){
      return false;
    };
    var threw = false;
    try{
      var controller = new tileClearControllerModule.TileClearController(grid);
    } catch (e){
      threw = true;
    } finally {
      gridModule.isValidGrid = tmp;
      assert(threw);
    }
  });
});

describe('TileClearController markTilesToClear', function(){
  it('marks three consecutive tiles in same row with same non-empty state', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var someRow = grid.rowCount - 2;
    var tile1 = grid.tileAt(2, someRow);
    var tile2 = grid.tileAt(3, someRow);
    var tile3 = grid.tileAt(4, someRow);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.A;
    tile3.state = gridModule.TileState.A;
    controller.markTilesToClear();
    assert(tile1.markedToClear && tile2.markedToClear && tile3.markedToClear);
  });
  it('doesn\'t mark three consecutive tiles in bottom row with same non-empty state', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var bottomY = grid.rowCount - 1;
    var tile1 = grid.tileAt(2, bottomY);
    var tile2 = grid.tileAt(3, bottomY);
    var tile3 = grid.tileAt(4, bottomY);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.A;
    tile3.state = gridModule.TileState.A;
    controller.markTilesToClear();
    assert(!tile1.markedToClear && !tile2.markedToClear && !tile3.markedToClear);
  });
  it('does not mark three consecutive tiles in same row with different non-empty state', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var someRow = grid.rowCount - 2;
    var tile1 = grid.tileAt(2, someRow);
    var tile2 = grid.tileAt(3, someRow);
    var tile3 = grid.tileAt(4, someRow);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.B;
    tile3.state = gridModule.TileState.A;
    controller.markTilesToClear();
    assert(!tile1.markedToClear && !tile2.markedToClear && !tile3.markedToClear);
  });
  it('marks all tiles if two sets of consecutive tiles are in the same row', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var someRow = grid.rowCount - 2;
    var tile1 = grid.tileAt(0, someRow);
    var tile2 = grid.tileAt(1, someRow);
    var tile3 = grid.tileAt(2, someRow);
    var tile4 = grid.tileAt(3, someRow);
    var tile5 = grid.tileAt(4, someRow);
    var tile6 = grid.tileAt(5, someRow);
    tile1.state = gridModule.TileState.C;
    tile2.state = gridModule.TileState.C;
    tile3.state = gridModule.TileState.C;
    tile4.state = gridModule.TileState.D;
    tile5.state = gridModule.TileState.D;
    tile6.state = gridModule.TileState.D;
    controller.markTilesToClear();
    assert(tile1.markedToClear); 
    assert(tile2.markedToClear); 
    assert(tile3.markedToClear);
    assert(tile4.markedToClear);
    assert(tile5.markedToClear);
    assert(tile6.markedToClear);
  });
  it('does not mark consecutive empty tiles', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var bottomY = grid.rowCount - 1;
    var tile1 = grid.tileAt(0, bottomY);
    var tile2 = grid.tileAt(1, bottomY);
    var tile3 = grid.tileAt(2, bottomY);
    var tile4 = grid.tileAt(3, bottomY);
    var tile5 = grid.tileAt(4, bottomY);
    var tile6 = grid.tileAt(5, bottomY);
    controller.markTilesToClear();
    assert(!tile1.markedToClear); 
    assert(!tile2.markedToClear); 
    assert(!tile3.markedToClear);
    assert(!tile4.markedToClear);
    assert(!tile5.markedToClear);
    assert(!tile6.markedToClear);
  });
  it('marks three consecutive tiles in same column with same non-empty state', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var rightX = grid.columnCount - 1;
    var tile1 = grid.tileAt(rightX, 2);
    var tile2 = grid.tileAt(rightX, 3);
    var tile3 = grid.tileAt(rightX, 4);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.A;
    tile3.state = gridModule.TileState.A;
    controller.markTilesToClear();
    assert(tile1.markedToClear && tile2.markedToClear && tile3.markedToClear);
  });
  it('does not mark three consecutive tiles in same column with different non-empty state', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var rightX = grid.columnCount - 1;
    var tile1 = grid.tileAt(rightX, 2);
    var tile2 = grid.tileAt(rightX, 3);
    var tile3 = grid.tileAt(rightX, 4);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.B;
    tile3.state = gridModule.TileState.A;
    controller.markTilesToClear();
    assert(!tile1.markedToClear && !tile2.markedToClear && !tile3.markedToClear);
  });
  it('marks all tiles if two sets of consecutive tiles are in the same column', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var rightX = grid.columnCount - 1;
    var tile1 = grid.tileAt(rightX, 0);
    var tile2 = grid.tileAt(rightX, 1);
    var tile3 = grid.tileAt(rightX, 2);
    var tile4 = grid.tileAt(rightX, 3);
    var tile5 = grid.tileAt(rightX, 4);
    var tile6 = grid.tileAt(rightX, 5);
    tile1.state = gridModule.TileState.C;
    tile2.state = gridModule.TileState.C;
    tile3.state = gridModule.TileState.C;
    tile4.state = gridModule.TileState.D;
    tile5.state = gridModule.TileState.D;
    tile6.state = gridModule.TileState.D;
    controller.markTilesToClear();
    assert(tile1.markedToClear); 
    assert(tile2.markedToClear); 
    assert(tile3.markedToClear);
    assert(tile4.markedToClear);
    assert(tile5.markedToClear);
    assert(tile6.markedToClear);
  });
  it('allows tiles to be shared vertically and horizontally', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var tile1 = grid.tileAt(0, grid.rowCount - 2);
    var tile2 = grid.tileAt(1, grid.rowCount - 2);
    var tile3 = grid.tileAt(2, grid.rowCount - 2);
    var tile4 = grid.tileAt(1, grid.rowCount - 3);
    var tile5 = grid.tileAt(1, grid.rowCount - 4);
    tile1.state = gridModule.TileState.C;
    tile2.state = gridModule.TileState.C;
    tile3.state = gridModule.TileState.C;
    tile4.state = gridModule.TileState.C;
    tile5.state = gridModule.TileState.C;
    controller.markTilesToClear();
    assert(tile1.markedToClear); 
    assert(tile2.markedToClear); 
    assert(tile3.markedToClear);
    assert(tile4.markedToClear);
    assert(tile5.markedToClear);
  });
  it('returns true if any tiles are marked to clear', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var someRow = grid.rowCount - 2;
    var tile1 = grid.tileAt(2, someRow);
    var tile2 = grid.tileAt(3, someRow);
    var tile3 = grid.tileAt(4, someRow);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.A;
    tile3.state = gridModule.TileState.A;
    var somethingWasMarked = controller.markTilesToClear();
    assert(somethingWasMarked);
  });
  it('returns false if no tiles are marked to clear', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var bottomY = grid.rowCount - 1;
    var tile1 = grid.tileAt(2, bottomY);
    var tile2 = grid.tileAt(3, bottomY);
    var tile3 = grid.tileAt(4, bottomY);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.B;
    tile3.state = gridModule.TileState.A;
    var somethingWasMarked = controller.markTilesToClear();
    assert(!somethingWasMarked);
  });
});

describe('TileClearController clearMarkedTiles', function(){
  it('sets all marked tiles to empty', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var tile1 = grid.tileAt(2, 0);
    var tile2 = grid.tileAt(2, 1);
    var tile3 = grid.tileAt(2, 2);
    var tile4 = grid.tileAt(1, 0);
    tile1.markedToClear = true;
    tile2.markedToClear = true;
    tile3.markedToClear = true;
    tile4.markedToClear = true;
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.B;
    tile3.state = gridModule.TileState.C;
    tile4.state = gridModule.TileState.D;
    controller.clearMarkedTiles();
    assert(tile1.state === gridModule.TileState.EMPTY);
    assert(tile2.state === gridModule.TileState.EMPTY);
    assert(tile3.state === gridModule.TileState.EMPTY);
    assert(tile4.state === gridModule.TileState.EMPTY);
  });
  it('unmarks all marked tiles', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
    var tile1 = grid.tileAt(2, 0);
    var tile2 = grid.tileAt(2, 1);
    var tile3 = grid.tileAt(2, 2);
    var tile4 = grid.tileAt(1, 0);
    tile1.markedToClear = true;
    tile2.markedToClear = true;
    tile3.markedToClear = true;
    tile4.markedToClear = true;
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.B;
    tile3.state = gridModule.TileState.C;
    tile4.state = gridModule.TileState.D;
    controller.clearMarkedTiles();
    assert(tile1.markedToClear === false);
    assert(tile2.markedToClear === false);
    assert(tile3.markedToClear === false);
    assert(tile4.markedToClear === false);
  });
});
