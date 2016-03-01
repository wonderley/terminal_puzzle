/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../src/grid.js');
var gridDelegateModule = require('../src/grid_delegate.js');
var my_grid = new gridModule.Grid();

describe('grid', function(){
  it('should have height and width', function(){
    assert(my_grid.rowCount !== undefined);
    assert(my_grid.columnCount !== undefined);
  });
  it('height should default to 12', function(){
    assert(my_grid.rowCount === 12);
  });
  it('width should default to 6', function(){
    assert(my_grid.columnCount === 6);
  });
  it('should allow access to tiles', function(){
    assert(my_grid.tileAt(0, 0) !== undefined);
  });
  it('should throw exception if I access tile with x too big', function(){
    var height = my_grid.rowCount;
    var width = my_grid.columnCount;
    var threw = false;
    try {
      my_grid.tileAt(width, 0);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with y too big', function(){
    var height = my_grid.rowCount;
    var width = my_grid.columnCount;
    var threw = false;
    try {
      my_grid.tileAt(0, height);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with negative x', function(){
    var height = my_grid.rowCount;
    var width = my_grid.columnCount;
    var threw = false;
    try {
      my_grid.tileAt(-1, 0);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with negative y', function(){
    var height = my_grid.rowCount;
    var width = my_grid.columnCount;
    var threw = false;
    try {
      my_grid.tileAt(0, -1);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should allow access to all valid tiles', function(){
    for(var x = 0; x < my_grid.columnCount; ++x){
      for(var y = 0; y < my_grid.rowCount; ++y){
        var tile = my_grid.tileAt(x, y);
        assert(tile !== undefined);
      }
    }
  });
  it('should start with all tiles unoccupied', function(){
    for(var x = 0; x < my_grid.columnCount; ++x){
      for(var y = 0; y < my_grid.rowCount; ++y){
        var tile = my_grid.tileAt(x, y);
        assert(tile.state === gridModule.TileState.EMPTY);
      }
    }
  });
  it('can have its rows advanced', function(){
    assert(my_grid.advanceRows !== undefined);
  });
  it('has bottom row occupied after row is advanced', function(){
    var grid = new gridModule.Grid();
    grid.advanceRows();
    for(var x = 0; x < grid.columnCount; ++x){
      var tile = grid.tileAt(x, grid.rowCount - 1);
      assert(tile.state !== gridModule.TileState.EMPTY);
    }
  });
  it('shifts all rows up by one when rows are advanced', function(){
    var grid = new gridModule.Grid();
    var original_grid = [];
    for(var y = 0; y < grid.rowCount; ++y){
      var row = [];
      for(var x = 0; x < grid.columnCount; ++x){
        var tile = grid.tileAt(x, y);
        row.push(tile);
      }
      original_grid.push(row);
    }
    grid.advanceRows();
    original_grid.forEach(function(row, y){
      if (y === 0) {
        // Top row is gone
        return;
      }
      row.forEach(function(tile, x){
        var sameTileInNewPosition = grid.tileAt(x, y-1);
        assert(tile.id === sameTileInNewPosition.id);
      });
    });
  });
  it('accepts a GridDelegate as the first argument to its constructor', function(){
    var delegate = {};
    var tmp = gridDelegateModule.isGridDelegate;
    var grid;
    var threw = false;
    try{
      gridDelegateModule.isGridDelegate = function(){ return true; };
      grid = new gridModule.Grid(delegate);
    } catch (e) {
      threw = true;
    } finally {
      assert(!threw);
      assert(grid.delegate === delegate);
      gridDelegateModule.isGridDelegate = tmp;
    }
  });
  it('throws if an invalid GridDelegate is passed', function(){
    var delegate = {};
    var grid;
    var threw = false;
    try{
      grid = new gridModule.Grid(delegate);
    } catch (e) {
      threw = true;
    } finally {
      assert(threw);
    }
  });
});

describe('TileState allOccupied', function(){
  it('returns all valid occupied states', function(){
    var validStates = gridModule.TileState.allOccupied();
    assert(validStates[0] === gridModule.TileState.EMPTY + 1);
    assert(validStates[validStates.length - 1] === gridModule.TileState.COUNT - 1);
    assert(validStates.length === gridModule.TileState.COUNT - 1);
  });
});

describe('randomOccupiedTileState', function(){
  it('only returns valid occupied tile states', function(){
    for (var i = 0; i < 100; ++i){
      var validStates = gridModule.TileState.allOccupied();
      var randomState = gridModule.randomOccupiedTileState(validStates);
      assert(randomState > gridModule.TileState.EMPTY);
      assert(randomState < gridModule.TileState.COUNT);
    }
  });
  it('requires a list of valid allowed tile states', function(){
    var threw = false;
    try{
      gridModule.randomOccupiedTileState();
    } catch (e){
      threw = true;
    }
    assert(threw);
    threw = false;
    try{
      gridModule.randomOccupiedTileState([]);
    } catch (e){
      threw = true;
    }
    assert(threw);
    threw = false;
    try{
      gridModule.randomOccupiedTileState([gridModule.TileState.EMPTY]);
    } catch (e){
      threw = true;
    }
    assert(threw);
    threw = false;
    try{
      gridModule.randomOccupiedTileState([gridModule.TileState.COUNT]);
    } catch (e){
      threw = true;
    }
    assert(threw);    
  });
  it('Returns tiles with the allowed states', function(){
    var allowedStates = gridModule.TileState.allOccupied();
    var usedStates = {};
    // Make sure each state gets used at least once
    allowedStates.forEach(function(state){
      usedStates[state.toString()] = false;
    });
    for (var i = 0; i < 100; ++i){
      var state = gridModule.randomOccupiedTileState(allowedStates);
      assert(state > gridModule.TileState.EMPTY);
      assert(state < gridModule.TileState.COUNT);
      usedStates[state.toString()] = true;
    }
    allowedStates.forEach(function(state){
      assert(usedStates[state.toString()] === true);
    });
  });
  it('Only uses the passed states even if it\'s not all of them', function(){
    var allowedStates = [gridModule.TileState.A, gridModule.TileState.C];
    var usedStates = {};
    // Make sure each state gets used at least once
    allowedStates.forEach(function(state){
      usedStates[state.toString()] = false;
    });
    for (var i = 0; i < 100; ++i){
      var state = gridModule.randomOccupiedTileState(allowedStates);
      assert(state > gridModule.TileState.EMPTY);
      assert(state < gridModule.TileState.COUNT);
      usedStates[state.toString()] = true;
    }
    allowedStates.forEach(function(state){
      assert(usedStates[state.toString()] === true);
    });
  });
});

describe('rowAt', function(){
  it('should return the specified row', function(){
    var grid = new gridModule.Grid();
    grid.advanceRows();
    // Get the values in the newly created row
    var manuallyGeneratedRow = [];
    for(var x = 0; x < grid.columnCount; ++x){
      manuallyGeneratedRow.push(grid.tileAt(x, grid.rowCount - 1));
    }
    var returnedRow = grid.rowAt(grid.rowCount - 1);
    returnedRow.forEach(function(tile, idx){
      assert(tile.state === manuallyGeneratedRow[idx].state);
    });
  });
});

describe('rowAt', function(){
  it('should throw if row passed is greater than or equal to height', function(){
    var grid = new gridModule.Grid();
    var threw = false;
    try {
      grid.rowAt(grid.rowCount);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw if row passed is negative', function(){
    var grid = new gridModule.Grid();
    var threw = false;
    try {
      grid.rowAt(-1);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
});

describe('The module', function(){
  it('exports the function isValidGrid', function(){
    assert(gridModule.isValidGrid !== undefined);
  });
});

describe('isValidGrid', function(){
  it('fails if falsy value is passed', function(){
    assert(gridModule.isValidGrid() === false);
    assert(gridModule.isValidGrid(null) === false);
    assert(gridModule.isValidGrid(false) === false);
  });
  it('succeeds if a grid is passed', function(){
    var grid = new gridModule.Grid();
    assert(gridModule.isValidGrid(grid) === true);
  });
});

describe('Grid swapTilesAt', function(){
  it('swaps the two tiles given their x and y values', function(){
    var grid = new gridModule.Grid();
    var tile1 = grid.tileAt(1,1);
    var tile2 = grid.tileAt(2,1);
    grid.swapTilesAt(1, 1, 2, 1);
    assert(grid.tileAt(1,1) === tile2);
    assert(grid.tileAt(2,1) === tile1);
  });
});

describe('Grid columnAt', function(){
  it('returns the tiles in the corresponding column', function(){
    var grid = new gridModule.Grid();
    var x = 2;
    var column = [];
    for (var y = 0; y < grid.rowCount; ++y){
      column.push(grid.tileAt(x, y));
    }
    var returnedColumn = grid.columnAt(x);
    for (y = 0; y < grid.rowCount; ++y){
      assert(column[y] === returnedColumn[y]);
    }
  });
});

describe('Grid generateRandomRow', function(){
  it('returns an array of tiles with the right width', function(){
    var grid = new gridModule.Grid();
    var row = grid.generateRandomRow();
    assert(row.length === grid.columnCount);
  });
  it('normally passes all occupied states to randomOccupiedTileState', function(){
    var grid = new gridModule.Grid();
    var allowedStates_arg = null;
    var tmp = gridModule.randomOccupiedTileState;
    gridModule.randomOccupiedTileState = function(allowedStates){
      allowedStates_arg = allowedStates;
    };
    grid.generateRandomRow();
    var allOccupied = gridModule.TileState.allOccupied();
    assert(allOccupied.length === allowedStates_arg.length);
    allowedStates_arg.forEach(function(state, idx){
      assert(state === allOccupied[idx]);
    });
    gridModule.randomOccupiedTileState = tmp;
  });
  it('does not allow three consecutive tiles of the same state', function(){
    var grid = new gridModule.Grid();
    var tmp = gridModule.randomOccupiedTileState;
    
    // Use these two functions to enforce that A should be allowed
    // the first two times, but not the third.
    var checkThatAIsAllowedCalledCount = 0;
    function checkThatAIsAllowedAndReturnA(allowedStates){
      var aFound = false;
      for (var i = 0; i < allowedStates.length; ++i){
        if (allowedStates[i] === gridModule.TileState.A){
          aFound = true;
        }
      }
      assert(aFound);
      checkThatAIsAllowedCalledCount += 1;
      if (checkThatAIsAllowedCalledCount === 2){
        gridModule.randomOccupiedTileState = checkThatAIsNotAllowedAndReturnB;
      }
      return gridModule.TileState.A;
    }
    function checkThatAIsNotAllowedAndReturnB(allowedStates){
      var aFound = false;
      for (var i = 0; i < allowedStates.length; ++i){
        if (allowedStates[i] === gridModule.TileState.A){
          aFound = true;
        }
      }
      assert(!aFound);
      checkThatAIsAllowedCalledCount = 0;
      gridModule.randomOccupiedTileState = checkThatAIsAllowedAndReturnA;
      return gridModule.TileState.B;
    }
    gridModule.randomOccupiedTileState = checkThatAIsAllowedAndReturnA;
    grid.generateRandomRow();
  });
  it('has reasonable dimensions', function(){
    var grid = new gridModule.Grid();
    assert(grid.rowCount >= 5);
    assert(grid.columnCount >= 5);
  });
});

describe('Grid advanceRows', function(){
  it('calls onGameOver on delegate if it is called when tiles are at the top', function(){
    var grid = new gridModule.Grid();
    var onGameOverCalls = 0;
    grid.delegate = {
      onGameOver: function(){
        onGameOverCalls += 1;
      }
    };
    for (var i = 0; i < grid.rowCount; ++i){
      grid.advanceRows();
      assert(onGameOverCalls === 0);
    }
    grid.advanceRows();
    assert(onGameOverCalls === 1);
  });
});
