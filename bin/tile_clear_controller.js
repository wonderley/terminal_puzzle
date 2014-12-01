#! /usr/local/bin/node
var Grid = require('./grid.js');

(function(){

"use strict";

/**
 * Searches the grid for tiles that should be cleared.
 */
function TileClearController(grid){
  if (!Grid.isValidGrid(grid)){
    throw 'Invalid grid';
  }
  var _grid = grid;
  this.markTilesToClear = function(){
    var markEachTile = function(tile, idx, arr){
      arr[idx].markedToClear = true;
    };
    var currentState = Grid.TileState.COUNT;
    var consecutiveTiles = [];
    var markConsecutiveTilesInArray = function(tileCopy, idx, arr){
      var tile = arr[idx];
      if (tile.state !== Grid.TileState.EMPTY &&
          tile.state === currentState){
        consecutiveTiles.push(tile);
      } else {
        if (consecutiveTiles.length >= 3){
          consecutiveTiles.forEach(markEachTile);
        }
        consecutiveTiles = [tile];
      }
      if (idx === arr.length - 1){
        // Handle the last item
        if (consecutiveTiles.length >= 3){
          consecutiveTiles.forEach(markEachTile);
        }
        consecutiveTiles = [];
        currentState = Grid.TileState.COUNT;
      }
      else {
        currentState = tile.state;
      }
    };
    // Iterate over each column and each row
    _grid.columnAt(0).forEach(function (tile_cpy, y, arr){
      _grid.rowAt(y).forEach(markConsecutiveTilesInArray);
    });
    _grid.rowAt(0).forEach(function (tile_cpy, x, arr){
      _grid.columnAt(x).forEach(markConsecutiveTilesInArray);
    });
  };
  this.clearMarkedTiles = function(){
    
  };
}

if (require.main === module) {
}
  
module.exports = {
  TileClearController: TileClearController
};

})();