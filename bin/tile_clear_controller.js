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
    
  };
}

if (require.main === module) {
}
  
module.exports = {
  TileClearController: TileClearController
};

})();