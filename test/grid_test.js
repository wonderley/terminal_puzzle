/* Run with mocha */
/* global require, describe, it */
let assert = require('assert');
let Grid = require('../src/grid.js').Grid;
const Tile = require('../src/tile.js').Tile;
const TileState = require('../src/tile.js').TileState;
let my_grid = new Grid();
let GameController = require('../src/game_controller.js').GameController;
const GravityController = require('../src/gravity_controller.js').GravityController;

describe('grid', function() {
  it('should have height and width', function() {
    assert(Grid.ROW_COUNT !== undefined);
    assert(Grid.COLUMN_COUNT !== undefined);
  });
  it('height should default to 12', function() {
    assert(Grid.ROW_COUNT === 12);
  });
  it('width should default to 6', function() {
    assert(Grid.COLUMN_COUNT === 6);
  });
  it('should allow access to tiles', function() {
    assert(my_grid.tileAt(0, 0) !== undefined);
  });
  it('should throw exception if I access tile with x too big', function() {
    let height = Grid.ROW_COUNT;
    let width = Grid.COLUMN_COUNT;
    let threw = false;
    try {
      my_grid.tileAt(width, 0);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with y too big', function() {
    let height = Grid.ROW_COUNT;
    let width = Grid.COLUMN_COUNT;
    let threw = false;
    try {
      my_grid.tileAt(0, height);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with negative x', function() {
    let height = Grid.ROW_COUNT;
    let width = Grid.COLUMN_COUNT;
    let threw = false;
    try {
      my_grid.tileAt(-1, 0);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with negative y', function() {
    let height = Grid.ROW_COUNT;
    let width = Grid.COLUMN_COUNT;
    let threw = false;
    try {
      my_grid.tileAt(0, -1);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should allow access to all valid tiles', function() {
    for(let x = 0; x < Grid.COLUMN_COUNT; ++x) {
      for(let y = 0; y < Grid.ROW_COUNT; ++y) {
        let tile = my_grid.tileAt(x, y);
        assert(tile !== undefined);
      }
    }
  });
  it('should start with all tiles unoccupied', function() {
    for(let x = 0; x < Grid.COLUMN_COUNT; ++x) {
      for(let y = 0; y < Grid.ROW_COUNT; ++y) {
        let tile = my_grid.tileAt(x, y);
        assert(tile.state === TileState.EMPTY);
      }
    }
  });
  it('can have its rows advanced', function() {
    assert(my_grid.advanceRows !== undefined);
  });
  it('has bottom row occupied after row is advanced', function() {
    const grid = new Grid();
    GameController.instance.view = {
      updateView: () => {},
    };
    GameController.instance.gravityController = new GravityController(grid, GameController.instance.view);
    grid.advanceRows();
    for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
      let tile = grid.tileAt(x, Grid.ROW_COUNT - 1);
      assert(tile.state !== TileState.EMPTY);
    }
  });
  it('shifts all rows up by one when rows are advanced', function() {
    let grid = new Grid();
    let original_grid = [];
    for(let y = 0; y < Grid.ROW_COUNT; ++y) {
      let row = [];
      for(let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        let tile = grid.tileAt(x, y);
        row.push(tile);
      }
      original_grid.push(row);
    }
    grid.advanceRows();
    original_grid.forEach(function(row, y) {
      if (y === 0) {
        // Top row is gone
        return;
      }
      row.forEach(function(tile, x) {
        let sameTileInNewPosition = grid.tileAt(x, y-1);
        assert(tile.id === sameTileInNewPosition.id);
      });
    });
  });
});

describe('randomOccupiedTileState', function() {
  it('only returns valid occupied tile states', function() {
    for (let i = 0; i < 100; ++i) {
      let validStates = Tile.NONEMPTY_STATES;
      let grid = new Grid();
      let randomState = grid.randomOccupiedTileState(validStates);
      assert(randomState > TileState.EMPTY);
      assert(randomState < TileState.COUNT);
    }
  });
  it('Returns tiles with the allowed states', function() {
    let grid = new Grid();
    let allowedStates = Tile.NONEMPTY_STATES;
    let usedStates = {};
    // Make sure each state gets used at least once
    allowedStates.forEach(function(state) {
      usedStates[state.toString()] = false;
    });
    for (let i = 0; i < 100; ++i) {
      let state = grid.randomOccupiedTileState(allowedStates);
      assert(state > TileState.EMPTY);
      assert(state < TileState.COUNT);
      usedStates[state.toString()] = true;
    }
    allowedStates.forEach(function(state) {
      assert(usedStates[state.toString()] === true);
    });
  });
  it('Only uses the passed states even if it\'s not all of them', function() {
    let grid = new Grid();
    let allowedStates = [TileState.A, TileState.C];
    let usedStates = {};
    // Make sure each state gets used at least once
    allowedStates.forEach(function(state) {
      usedStates[state.toString()] = false;
    });
    for (let i = 0; i < 100; ++i) {
      let state = grid.randomOccupiedTileState(allowedStates);
      assert(state > TileState.EMPTY);
      assert(state < TileState.COUNT);
      usedStates[state.toString()] = true;
    }
    allowedStates.forEach(function(state) {
      assert(usedStates[state.toString()] === true);
    });
  });
});

describe('rowAt', function() {
  it('should return the specified row', function() {
    let grid = new Grid();
    grid.advanceRows();
    // Get the values in the newly created row
    let manuallyGeneratedRow = [];
    for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
      manuallyGeneratedRow.push(grid.tileAt(x, Grid.ROW_COUNT - 1));
    }
    let returnedRow = grid.rowAt(Grid.ROW_COUNT - 1);
    returnedRow.forEach(function(tile, idx) {
      assert(tile.state === manuallyGeneratedRow[idx].state);
    });
  });
});

describe('rowAt', function() {
  it('should throw if row passed is greater than or equal to height', function() {
    let grid = new Grid();
    let threw = false;
    try {
      grid.rowAt(Grid.ROW_COUNT);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw if row passed is negative', function() {
    let grid = new Grid();
    let threw = false;
    try {
      grid.rowAt(-1);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
});

describe('Grid swapTilesAt', function() {
  it('swaps the two tiles given their x and y values', function() {
    let grid = new Grid();
    let tile1 = grid.tileAt(1,1);
    let tile2 = grid.tileAt(2,1);
    grid.swapTilesAt(1, 1, 2, 1);
    assert(grid.tileAt(1,1) === tile2);
    assert(grid.tileAt(2,1) === tile1);
  });
});

describe('Grid columnAt', function() {
  it('returns the tiles in the corresponding column', function() {
    let grid = new Grid();
    let x = 2;
    let column = [];
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      column.push(grid.tileAt(x, y));
    }
    let returnedColumn = grid.columnAt(x);
    for (y = 0; y < Grid.ROW_COUNT; ++y) {
      assert(column[y] === returnedColumn[y]);
    }
  });
});

describe('Grid generateRandomRow', function() {
  it('returns an array of tiles with the right width', function() {
    let grid = new Grid();
    let row = grid.generateRandomRow();
    assert(row.length === Grid.COLUMN_COUNT);
  });
  it('normally passes all occupied states to randomOccupiedTileState', function() {
    let grid = new Grid();
    let allowedStates_arg = null;
    let tmp = grid.randomOccupiedTileState;
    grid.randomOccupiedTileState = function(allowedStates) {
      allowedStates_arg = allowedStates;
    };
    grid.generateRandomRow();
    let allOccupied = Tile.NONEMPTY_STATES;
    assert(allOccupied.length === allowedStates_arg.length);
    allowedStates_arg.forEach(function(state, idx) {
      assert(state === allOccupied[idx]);
    });
  });
  it('does not allow three consecutive tiles of the same state', function() {
    let grid = new Grid();
    
    // Use these two functions to enforce that A should be allowed
    // the first two times, but not the third.
    let checkThatAIsAllowedCalledCount = 0;
    function checkThatAIsAllowedAndReturnA(allowedStates) {
      let aFound = false;
      for (let i = 0; i < allowedStates.length; ++i) {
        if (allowedStates[i] === TileState.A) {
          aFound = true;
        }
      }
      assert(aFound);
      checkThatAIsAllowedCalledCount += 1;
      if (checkThatAIsAllowedCalledCount === 2) {
        grid.randomOccupiedTileState = checkThatAIsNotAllowedAndReturnB;
      }
      return TileState.A;
    }
    function checkThatAIsNotAllowedAndReturnB(allowedStates) {
      let aFound = false;
      for (let i = 0; i < allowedStates.length; ++i) {
        if (allowedStates[i] === TileState.A) {
          aFound = true;
        }
      }
      assert(!aFound);
      checkThatAIsAllowedCalledCount = 0;
      grid.randomOccupiedTileState = checkThatAIsAllowedAndReturnA;
      return TileState.B;
    }
    grid.randomOccupiedTileState = checkThatAIsAllowedAndReturnA;
    grid.generateRandomRow();
  });
  it('has reasonable dimensions', function() {
    let grid = new Grid();
    assert(Grid.ROW_COUNT >= 5);
    assert(Grid.COLUMN_COUNT >= 5);
  });
});

describe('Grid advanceRows', function() {
  it('calls onGameOver on delegate if it is called when tiles are at the top', function() {
    let grid = new Grid();
    let onGameOverCalls = 0;
    let realOnGameOver = GameController.instance.onGameOver;
    try {
      GameController.instance.onGameOver = function() {
        onGameOverCalls += 1;
      };
      for (let i = 0; i < Grid.ROW_COUNT; ++i) {
        grid.advanceRows();
        assert(onGameOverCalls === 0);
      }
      grid.advanceRows();
      assert(onGameOverCalls === 1);
    }
    finally {
      GameController.instance.onGameOver = realOnGameOver;
    }
  });
});
