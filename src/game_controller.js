#! /usr/bin/env node
var Grid = require('./grid.js');
var TerminalGridView = require('./terminal_grid_view.js');
var Cursor = require('./cursor.js');
var TerminalInputController = require('./terminal_input_controller.js');
var GravityController = require('./gravity_controller.js');
var TileClearController = require('./tile_clear_controller.js');

(function(){

"use strict";
  
function GameController(){
  // public - GridDelegate methods
  this.onGridChanged = function(){
    _view.updateView();
    setTimeout(function(){
      _gravityController.applyGravity();
      _view.updateView();
      evaluateGrid();
    }, 200);
  };
  this.onGameOver = function(){
    clearInterval(advanceGameIntervalId);
    advanceGameIntervalId = setInterval(advanceGame, _gameAdvanceIntervalInMillis);
  };
  var that = this;
  var evaluateGrid = function(){
    if (!_tileClearController.markTilesToClear()){
      return;
    }
    _view.updateView();
    setTimeout(function(){
      _tileClearController.clearMarkedTiles();
      _view.updateView();
      setTimeout(function(){
        that.onGridChanged();
      }, 100);
    }, 500);
  };
  var _grid = new Grid.Grid(this);
  var _view = new TerminalGridView.TerminalGridView(_grid);
  var _cursor = new Cursor.Cursor(_grid, _view);
  var _inputController = new TerminalInputController.TerminalInputController(_cursor);
  _view.setInputDelegate(_inputController);
  var _gravityController = new GravityController.GravityController(_grid, _view);
  var _tileClearController = new TileClearController.TileClearController(_grid);
  var _gameAdvanceIntervalInMillis = 3000;
  var advanceGame = function(){
    _grid.advanceRowsSmall();
    if (_grid.currentSubrow === 0) {
      // Assume that the rows have just advanced to the next row.
      // Move the cursor to the next row.
     if (_cursor.getY() > 0){
       _cursor.setPosition(_cursor.getX(), _cursor.getY() - 1);
     }
    }
  };
  var advanceGameIntervalId = null;

  // public
  this.startGame = function(){
    _view.initializeView();
    _cursor.setPosition(_grid.columnCount / 2, _grid.rowCount / 2);
    advanceGameIntervalId = setInterval(advanceGame, _gameAdvanceIntervalInMillis);
  };
}
  
module.exports = GameController;

})();
