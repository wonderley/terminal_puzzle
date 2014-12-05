#! /usr/local/bin/node
var Grid = require('./grid.js');
var TerminalGridView = require('./terminal_grid_view.js');
var Cursor = require('./cursor.js');
var TerminalInputController = require('./terminal_input_controller.js');
var GravityController = require('./gravity_controller.js');
var TileClearController = require('./tile_clear_controller.js');

(function(){

"use strict";
  
function GameController(){
  // public - GridDelegate method
  this.onGridChanged = function(){
    _view.updateView();
    evaluateTilesToBeCleared();
  };
  
  // private
  var that = this;
  var _grid = new Grid.Grid(this);
  var _view = new TerminalGridView.TerminalGridView(_grid);
  var _cursor = new Cursor.Cursor(_grid, _view);
  var _inputController = new TerminalInputController.TerminalInputController(_cursor);
  _view.setInputDelegate(_inputController);
  var _gravityController = new GravityController.GravityController(_grid, _view);
  var _tileClearController = new TileClearController.TileClearController(_grid);
  var _gameAdvanceIntervalInMillis = 5000;
  var advanceGame = function(){
    _grid.advanceRows();
  };
  var evaluateTilesToBeCleared = function(){
    _inputController.isLocked = true;
    if (!_tileClearController.markTilesToClear()){
      _inputController.isLocked = false;
      return;
    }
    _view.updateView();
    setTimeout(function(){
      _tileClearController.clearMarkedTiles();
      _view.updateView();
      setTimeout(function(){
        _gravityController.applyGravity();
        that.onGridChanged();
      }, 100);
    }, 500);
  };
  
  // public
  this.startGame = function(){
    _view.initializeView();
    _cursor.setPosition(_grid.width / 2, _grid.height / 2);
    setInterval(advanceGame, _gameAdvanceIntervalInMillis);
  };
}
  
if (require.main === module) {
  var controller = new GameController();
  controller.startGame();
}
  
module.exports = {
  GameController: GameController
};

})();