#! /usr/local/bin/node
var Grid = require('./grid.js');

(function(){

"use strict";

function TerminalGridView(gridMC){
  if (!Grid.isValidGrid(gridMC)){
    throw 'Not a valid Grid.';
  }
  var _gridMC = gridMC;
  var _tileStrings = [ '[  ]', '[XX]', '[OO]', '[||]', '[$$]' ];
  var mapTileToString = function(tile){
      return _tileStrings[tile.state];
  };
  this.displayGrid = function(){
    console.log();
    for (var y = 0; y < _gridMC.height; ++y){
      var row = _gridMC.rowAt(y);
      var stringifiedRow = row.map(mapTileToString).join('');
      console.log(stringifiedRow);
    }
    console.log();
  };
}
  
if (require.main === module) {
  var grid = new Grid.Grid();
  var view = new TerminalGridView(grid);
  view.displayGrid();
  for (var i = 0; i < grid.height; ++i)
  {
    grid.advanceRows();
    view.displayGrid();
  }
}
  
module.exports = {
  TerminalGridView: TerminalGridView
};
  
})();