#! /usr/local/bin/node

(function(){

"use strict";

function Grid() {
  // private
  var _rows = [];
  var populate = function(){
    for (var i = 0; i < that.height; ++i) {
      addRow();
    }
  };
  var addRow = function(){
    var row = [];
    for (var j = 0; j < that.width; ++j) {
      var tile = new Tile();
      row.push(tile);
    }
    _rows.push(row);
  };
  var addPopulatedRow = function(){
    var row = [];
    for (var j = 0; j < that.width; ++j) {
      var tile = new Tile();
      tile.state = randomOccupiedTileState();
      row.push(tile);
    }
    _rows.push(row);
  };
  var removeRow = function(){
    _rows.shift();
  };
  
  // public
  this.height = 12;
  this.width = 6;
  // this.gravityController = new GravityController(this);
    // this.tileClearController = new TileClearController();
  this.tileAt = function(x,y){
    if (x >= this.width ||
        y >= this.height ||
        x < 0 ||
        y < 0){
      throw 'out of bounds';
    }
    return _rows[y][x];
  };
  this.rowAt = function(y){
    if (y >= this.height ||
        y < 0){
      throw 'out of bounds';
    }
    return _rows[y];
  };
  this.columnAt = function(x){
    var column = [];
    for (var y = 0; y < this.height; ++y){
      column.push(this.tileAt(x, y));
    }
    return column;
  };
  this.swapTilesAt = function(x1, y1, x2, y2){
    var tile1 = _rows[y1][x1];
    _rows[y1][x1] = _rows[y2][x2];
    _rows[y2][x2] = tile1;
  };
  /**
   * Bring the rows upwards by one and add a new row
   * of occupied tiles to the bottom.
   */
  this.advanceRows = function() {
    addPopulatedRow();
    removeRow();
  };
  var that = this; 
  populate();
}

var __tileCount = 0;
var TileState = {
    EMPTY: 0,
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    COUNT: 5
};
function Tile(){
  this.state = TileState.EMPTY;
  this.id = __tileCount;
  __tileCount += 1;
}
  
function randomOccupiedTileState(){
  var randomFloat = Math.random() * (TileState.COUNT - TileState.A) + TileState.A;
  return Math.floor(randomFloat);
}
  
function isValidGrid(grid){
  return grid instanceof Grid;
}

module.exports = {
  Grid: Grid,
  TileState: TileState,
  randomOccupiedTileState: randomOccupiedTileState,
  isValidGrid: isValidGrid
};
  
})();