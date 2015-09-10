#! /usr/bin/env node
var Grid = require('./grid.js');
var TerminalGridView = require('./terminal_grid_view.js');

(function(){

"use strict";
  
function Cursor(grid, view){
  var _grid = grid;
  var _view = view;
  if (!Grid.isValidGrid(grid)){
    throw 'Not a valid Grid.';
  }
  if (!TerminalGridView.isValidView(view)){
    throw 'Not a valid view.';  
  }
  var _x = -1;
  var _y = -1;
  this.getX = function(){
    return _x;
  };
  this.getY = function(){
    return _y;
  };
  this.isValidCursorPosition = function(x,y){
    return x >= 0 &&
      x < _grid.columnCount - 1 &&
      y >= 0 &&
      y < _grid.rowCount - 1;
  };
  this.setPosition = function(x,y){
    if (!this.isValidCursorPosition(x,y)){
      throw 'Invalid position';  
    }
    if(_x === x && _y === y){
      return;
    }
    if (_x !== -1 && _y !== -1){
      // if not first time this is called
      view.clearCursorAt(_x, _y);
    }
    _x = x;
    _y = y;
    view.drawCursorAt(_x, _y);
  };
  this.goUp = function(){
    var newX = _x;
    var newY = _y - 1;
    if (this.isValidCursorPosition(newX, newY)){
      this.setPosition(newX, newY);
    }
  };
  this.goDown = function(){
    var newX = _x;
    var newY = _y + 1;
    if (this.isValidCursorPosition(newX, newY)){
      this.setPosition(newX, newY);
    }
  };
  this.goLeft = function(){
    var newX = _x - 1;
    var newY = _y;
    if (this.isValidCursorPosition(newX, newY)){
      this.setPosition(newX, newY);
    }
  };
  this.goRight = function(){
    var newX = _x + 1;
    var newY = _y;
    if (this.isValidCursorPosition(newX, newY)){
      this.setPosition(newX, newY);
    }
  };
  this.swapTiles = function(){
    _grid.swapTilesAt(_x, _y, _x + 1, _y);
    if (_grid.delegate){
      _grid.delegate.onGridChanged();
    }
  };
}
  
function isValidCursor(cursor){
  return cursor instanceof Cursor;
}
  
module.exports = {
  Cursor: Cursor,
  isValidCursor: isValidCursor
};

})();
