#! /usr/bin/env node
var Grid = require('./grid.js');

(function(){

"use strict";

/**
 * Searches the grid for tiles that should be cleared.
 * \return true if any tiles were marked to clear.
 */
function TileClearController(grid){
  if (!Grid.isValidGrid(grid)){
    throw 'Invalid grid';
  }
  var _grid = grid;
  this.markTilesToClear = function(){
    var somethingWasMarked = false;
    var markEachTile = function(tile, idx, arr){
      arr[idx].markedToClear = true;
    };
    var currentState = Grid.TileState.COUNT;
    var consecutiveTiles = [];
    function markConsecutiveTilesInArray(tile, idx, arr){
      if (tile.state !== Grid.TileState.EMPTY &&
          tile.state === currentState){
        consecutiveTiles.push(tile);
      } else {
        if (consecutiveTiles.length >= 3){
          somethingWasMarked = true;
          consecutiveTiles.forEach(markEachTile);
        }
        consecutiveTiles = [tile];
      }
      if (idx === arr.length - 1){
        // Handle the last item
        if (consecutiveTiles.length >= 3){
          somethingWasMarked = true;
          consecutiveTiles.forEach(markEachTile);
        }
        consecutiveTiles = [];
        currentState = Grid.TileState.COUNT;
      }
      else {
        currentState = tile.state;
      }
    }
    // Iterate over each row and each column
    // Exclude the last row from both processes because it's not "in play".
    for (var y = 0; y < _grid.rowCount - 1; ++y){
      _grid.rowAt(y).forEach(markConsecutiveTilesInArray);
    }
    for (var x = 0; x < _grid.columnCount; ++x){
      _grid.columnAt(x).slice(0, _grid.rowCount - 1).forEach(markConsecutiveTilesInArray);
    }
    return somethingWasMarked;
  };
  this.clearMarkedTiles = function(){
    function clearTileIfMarked(tile){
      if (tile.markedToClear){
        tile.state = Grid.TileState.EMPTY;
        tile.markedToClear = false;
      }
    }
    for (var y = 0; y < _grid.rowCount; ++y){
      _grid.rowAt(y).forEach(clearTileIfMarked);
    }
  };
}

if (require.main === module) {
}
  
module.exports = {
  TileClearController: TileClearController
};

})();
