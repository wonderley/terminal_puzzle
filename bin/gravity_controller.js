#! /usr/local/bin/node
var Grid = require('./grid.js');
var View = require('./terminal_grid_view');

(function(){

"use strict";

/**
 * Applies gravity to the Grid
 */
function GravityController(grid, view){
  if (!Grid.isValidGrid(grid)){
    throw 'Invalid grid';
  }
  if (!View.isValidView(view)){
    throw 'Invalid view';
  }
  var _grid = grid;
  var _view = view;
  var dropTileAt = function(x, y){
    var theTile = _grid.tileAt(x, y);
    for (var currentY = y; currentY < _grid.height - 1; ++currentY){
      var tileBelow = _grid.tileAt(x, currentY + 1);
      if (tileBelow.state !== Grid.TileState.EMPTY){
        break;
      }
      _grid.swapTilesAt(x, currentY, x, currentY + 1);
    }
  };
  /**
   * For now, just apply all gravity at once without animation or anything.
   */
  this.applyGravity = function(){
    // Start from the second row.
    for (var y = _grid.height - 2; y >= 0; --y){
      var row = _grid.rowAt(y);
      for (var x = 0; x < _grid.width; ++x){
        dropTileAt(x, y);
      }
    }
  };
}

if (require.main === module) {
}
  
module.exports = {
  GravityController: GravityController
};

})();