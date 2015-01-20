#! /usr/bin/env node
var GridDelegate = require('./grid_delegate.js');

(function(){

"use strict";

function Grid(delegate) {
  if (delegate !== null &&
      delegate !== undefined &&
      !GridDelegate.isGridDelegate(delegate)){
    throw 'Invalid GridDelegate passed to Grid constructor';
  }
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
    var row = that.generateRandomRow();
    _rows.push(row);
    if (delegate){
      delegate.onGridChanged();
    }
  };
  var removeRow = function(){
    _rows.shift();
    if (delegate){
      delegate.onGridChanged();
    }
  };
  
  // public
  this.delegate = delegate;
  this.height = 12;
  this.width = 6;
  this.generateRandomRow = function(width){
    var row = [];
    var lastTileState = {
      state: TileState.COUNT,
      count: 0
    };
    var isNotLastTileState = function(state){
      return state !== lastTileState.state;
    };
    var allowedStates = TileState.allOccupied();
    for (var j = 0; j < that.width; ++j) {
      var tile = new Tile();
      if (lastTileState.count >= 2){
        // Remove the state from the list of the allowed states
        allowedStates = allowedStates.filter(isNotLastTileState);
      }
      tile.state = module.exports.randomOccupiedTileState(allowedStates);
      if (tile.state === lastTileState.state){
        lastTileState.count += 1;
      } else {
        lastTileState.state = tile.state;
        lastTileState.count = 1;
        allowedStates = TileState.allOccupied();
      }
      row.push(tile);
    }
    return row;
  };
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
  COUNT: 5,
  allOccupied: function(){
    return [this.A, this.B, this.C, this.D];
  }
};
function Tile(){
  this.state = TileState.EMPTY;
  this.id = __tileCount;
  this.markedToClear = false;
  __tileCount += 1;
}
  
function randomOccupiedTileState(allowedStates){
  if (!Array.isArray(allowedStates)||
      allowedStates.length === 0){
    throw 'Did not pass an array of allowed states.';
  }
  allowedStates.forEach(function(state){
    if (state <= TileState.EMPTY || state >= TileState.COUNT){
      throw 'Invalid tile state';
    }
  });
  var randomFloat = Math.random() * (allowedStates.length);
  var tileIndex = Math.floor(randomFloat);
  return allowedStates[tileIndex];
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