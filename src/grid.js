#! /usr/bin/env node
var Game = require('./game_controller.js');

(function(){

"use strict";

function Grid() {
  // private
  var _rows = [];
  var populate = function(){
    for (var i = 0; i < that.rowCount; ++i) {
      addRow();
    }
  };
  var addRow = function(){
    var row = [];
    for (var j = 0; j < that.columnCount; ++j) {
      var tile = new Tile();
      row.push(tile);
    }
    _rows.push(row);
  };
  var addPopulatedRow = function(){
    var row = that.generateRandomRow();
    _rows.push(row);
    Game.onGridChanged();
  };
  var removeRow = function(){
    _rows.shift();
    Game.onGridChanged();
  };
  
  // public
  this.subrowsPerRow = 4;
  this.currentSubrow = 0;
  this.rowCount = 12;
  this.columnCount = 6;
  this.generateRandomRow = function(columnCount){
    var row = [];
    var lastTileState = {
      state: TileState.COUNT,
      count: 0
    };
    var isNotLastTileState = function(state){
      return state !== lastTileState.state;
    };
    var allowedStates = TileState.allOccupied();
    for (var j = 0; j < that.columnCount; ++j) {
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
    if (x >= this.columnCount ||
        y >= this.rowCount ||
        x < 0 ||
        y < 0){
      throw 'out of bounds';
    }
    return _rows[y][x];
  };
  this.rowAt = function(y){
    if (y >= this.rowCount ||
        y < 0){
      throw 'out of bounds';
    }
    return _rows[y];
  };
  this.columnAt = function(x){
    var column = [];
    for (var y = 0; y < this.rowCount; ++y){
      column.push(this.tileAt(x, y));
    }
    return column;
  };
  this.swapTilesAt = function(x1, y1, x2, y2){
    var tile1 = _rows[y1][x1];
    _rows[y1][x1] = _rows[y2][x2];
    _rows[y2][x2] = tile1;
  };
  this.advanceRowsSmall = function() {
    this.currentSubrow = (this.currentSubrow + 1) % this.subrowsPerRow;
    if (this.currentSubrow > 0) { 
      Game.onGridChanged();
      return;
    }
    else {
      this.advanceRows();
    }
  };
  /**
   * Bring the rows upwards by one and add a new row
   * of occupied tiles to the bottom.
   */
  this.advanceRows = function() {
    addPopulatedRow();
    var topRow = _rows[0];
    for (var i = 0; i < topRow.length; ++i){
      var topTile = topRow[i];
      if(topTile.state !== TileState.EMPTY){
        Game.onGameOver();
        return;
      }
    }
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