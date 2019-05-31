/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var Grid = require('../src/grid.js').Grid;
const TileState = require('../src/grid.js').TileState;
var my_grid = new Grid();
var GameController = require('../src/game_controller.js').GameController;
const GravityController = require('../src/gravity_Controller.js').GravityController;

describe('grid', function(){
  it('should have height and width', function(){
    assert(Grid.rowCount !== undefined);
    assert(Grid.columnCount !== undefined);
  });
  it('height should default to 12', function(){
    assert(Grid.rowCount === 12);
  });
  it('width should default to 6', function(){
    assert(Grid.columnCount === 6);
  });
  it('should allow access to tiles', function(){
    assert(my_grid.tileAt(0, 0) !== undefined);
  });
  it('should throw exception if I access tile with x too big', function(){
    var height = Grid.rowCount;
    var width = Grid.columnCount;
    var threw = false;
    try {
      my_grid.tileAt(width, 0);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with y too big', function(){
    var height = Grid.rowCount;
    var width = Grid.columnCount;
    var threw = false;
    try {
      my_grid.tileAt(0, height);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with negative x', function(){
    var height = Grid.rowCount;
    var width = Grid.columnCount;
    var threw = false;
    try {
      my_grid.tileAt(-1, 0);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw exception if I access tile with negative y', function(){
    var height = Grid.rowCount;
    var width = Grid.columnCount;
    var threw = false;
    try {
      my_grid.tileAt(0, -1);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should allow access to all valid tiles', function(){
    for(var x = 0; x < Grid.columnCount; ++x){
      for(var y = 0; y < Grid.rowCount; ++y){
        var tile = my_grid.tileAt(x, y);
        assert(tile !== undefined);
      }
    }
  });
  it('should start with all tiles unoccupied', function(){
    for(var x = 0; x < Grid.columnCount; ++x){
      for(var y = 0; y < Grid.rowCount; ++y){
        var tile = my_grid.tileAt(x, y);
        assert(tile.state === TileState.EMPTY);
      }
    }
  });
  it('can have its rows advanced', function(){
    assert(my_grid.advanceRows !== undefined);
  });
  it('has bottom row occupied after row is advanced', function() {
    const grid = new Grid();
    GameController.instance.view = {
      updateView: () => {},
    };
    GameController.instance.gravityController = new GravityController(grid, GameController.instance.view);
    grid.advanceRows();
    for (var x = 0; x < Grid.columnCount; ++x) {
      var tile = grid.tileAt(x, Grid.rowCount - 1);
      assert(tile.state !== TileState.EMPTY);
    }
  });
  it('shifts all rows up by one when rows are advanced', function(){
    var grid = new Grid();
    var original_grid = [];
    for(var y = 0; y < Grid.rowCount; ++y){
      var row = [];
      for(var x = 0; x < Grid.columnCount; ++x){
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
});

// describe('randomOccupiedTileState', function(){
//   it('only returns valid occupied tile states', function(){
//     for (var i = 0; i < 100; ++i){
//       var validStates = TileState.allOccupied();
//       var randomState = gridModule.randomOccupiedTileState(validStates);
//       assert(randomState > TileState.EMPTY);
//       assert(randomState < TileState.COUNT);
//     }
//   });
//   it('requires a list of valid allowed tile states', function(){
//     var threw = false;
//     try{
//       gridModule.randomOccupiedTileState();
//     } catch (e){
//       threw = true;
//     }
//     assert(threw);
//     threw = false;
//     try{
//       gridModule.randomOccupiedTileState([]);
//     } catch (e){
//       threw = true;
//     }
//     assert(threw);
//     threw = false;
//     try{
//       gridModule.randomOccupiedTileState([TileState.EMPTY]);
//     } catch (e){
//       threw = true;
//     }
//     assert(threw);
//     threw = false;
//     try{
//       gridModule.randomOccupiedTileState([TileState.COUNT]);
//     } catch (e){
//       threw = true;
//     }
//     assert(threw);    
//   });
//   it('Returns tiles with the allowed states', function(){
//     var allowedStates = TileState.allOccupied();
//     var usedStates = {};
//     // Make sure each state gets used at least once
//     allowedStates.forEach(function(state){
//       usedStates[state.toString()] = false;
//     });
//     for (var i = 0; i < 100; ++i){
//       var state = gridModule.randomOccupiedTileState(allowedStates);
//       assert(state > TileState.EMPTY);
//       assert(state < TileState.COUNT);
//       usedStates[state.toString()] = true;
//     }
//     allowedStates.forEach(function(state){
//       assert(usedStates[state.toString()] === true);
//     });
//   });
//   it('Only uses the passed states even if it\'s not all of them', function(){
//     var allowedStates = [TileState.A, TileState.C];
//     var usedStates = {};
//     // Make sure each state gets used at least once
//     allowedStates.forEach(function(state){
//       usedStates[state.toString()] = false;
//     });
//     for (var i = 0; i < 100; ++i){
//       var state = gridModule.randomOccupiedTileState(allowedStates);
//       assert(state > TileState.EMPTY);
//       assert(state < TileState.COUNT);
//       usedStates[state.toString()] = true;
//     }
//     allowedStates.forEach(function(state){
//       assert(usedStates[state.toString()] === true);
//     });
//   });
// }); lrw

describe('rowAt', function() {
  it('should return the specified row', function() {
    var grid = new Grid();
    grid.advanceRows();
    // Get the values in the newly created row
    var manuallyGeneratedRow = [];
    for (var x = 0; x < Grid.columnCount; ++x) {
      manuallyGeneratedRow.push(grid.tileAt(x, Grid.rowCount - 1));
    }
    var returnedRow = grid.rowAt(Grid.rowCount - 1);
    returnedRow.forEach(function(tile, idx){
      assert(tile.state === manuallyGeneratedRow[idx].state);
    });
  });
});

describe('rowAt', function(){
  it('should throw if row passed is greater than or equal to height', function(){
    var grid = new Grid();
    var threw = false;
    try {
      grid.rowAt(Grid.rowCount);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
  it('should throw if row passed is negative', function(){
    var grid = new Grid();
    var threw = false;
    try {
      grid.rowAt(-1);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
});

describe('Grid swapTilesAt', function(){
  it('swaps the two tiles given their x and y values', function(){
    var grid = new Grid();
    var tile1 = grid.tileAt(1,1);
    var tile2 = grid.tileAt(2,1);
    grid.swapTilesAt(1, 1, 2, 1);
    assert(grid.tileAt(1,1) === tile2);
    assert(grid.tileAt(2,1) === tile1);
  });
});

describe('Grid columnAt', function(){
  it('returns the tiles in the corresponding column', function(){
    var grid = new Grid();
    var x = 2;
    var column = [];
    for (var y = 0; y < Grid.rowCount; ++y){
      column.push(grid.tileAt(x, y));
    }
    var returnedColumn = grid.columnAt(x);
    for (y = 0; y < Grid.rowCount; ++y){
      assert(column[y] === returnedColumn[y]);
    }
  });
});

describe('Grid generateRandomRow', function(){
  it('returns an array of tiles with the right width', function(){
    var grid = new Grid();
    var row = grid.generateRandomRow();
    assert(row.length === Grid.columnCount);
  });
  // it('normally passes all occupied states to randomOccupiedTileState', function(){
  //   var grid = new Grid();
  //   var allowedStates_arg = null;
  //   var tmp = gridModule.randomOccupiedTileState;
  //   gridModule.randomOccupiedTileState = function(allowedStates){
  //     allowedStates_arg = allowedStates;
  //   };
  //   grid.generateRandomRow();
  //   var allOccupied = TileState.allOccupied();
  //   assert(allOccupied.length === allowedStates_arg.length);
  //   allowedStates_arg.forEach(function(state, idx){
  //     assert(state === allOccupied[idx]);
  //   });
  //   gridModule.randomOccupiedTileState = tmp;
  // });
  // it('does not allow three consecutive tiles of the same state', function(){
  //   var grid = new Grid();
  //   var tmp = gridModule.randomOccupiedTileState;
    
  //   // Use these two functions to enforce that A should be allowed
  //   // the first two times, but not the third.
  //   var checkThatAIsAllowedCalledCount = 0;
  //   function checkThatAIsAllowedAndReturnA(allowedStates){
  //     var aFound = false;
  //     for (var i = 0; i < allowedStates.length; ++i){
  //       if (allowedStates[i] === TileState.A){
  //         aFound = true;
  //       }
  //     }
  //     assert(aFound);
  //     checkThatAIsAllowedCalledCount += 1;
  //     if (checkThatAIsAllowedCalledCount === 2){
  //       gridModule.randomOccupiedTileState = checkThatAIsNotAllowedAndReturnB;
  //     }
  //     return TileState.A;
  //   }
  //   function checkThatAIsNotAllowedAndReturnB(allowedStates){
  //     var aFound = false;
  //     for (var i = 0; i < allowedStates.length; ++i){
  //       if (allowedStates[i] === TileState.A){
  //         aFound = true;
  //       }
  //     }
  //     assert(!aFound);
  //     checkThatAIsAllowedCalledCount = 0;
  //     gridModule.randomOccupiedTileState = checkThatAIsAllowedAndReturnA;
  //     return TileState.B;
  //   }
  //   gridModule.randomOccupiedTileState = checkThatAIsAllowedAndReturnA;
  //   grid.generateRandomRow();
  // }); lrw
  it('has reasonable dimensions', function(){
    var grid = new Grid();
    assert(Grid.rowCount >= 5);
    assert(Grid.columnCount >= 5);
  });
});

describe('Grid advanceRows', function(){
  it('calls onGameOver on delegate if it is called when tiles are at the top', function(){
    var grid = new Grid();
    var onGameOverCalls = 0;
    var realOnGameOver = GameController.instance.onGameOver;
    try {
      GameController.instance.onGameOver = function(){
        onGameOverCalls += 1;
      };
      for (var i = 0; i < Grid.rowCount; ++i){
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
