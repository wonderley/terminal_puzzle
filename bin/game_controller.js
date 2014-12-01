#! /usr/local/bin/node
var Grid = require('./grid.js');
var TerminalGridView = require('./terminal_grid_view.js');
var Cursor = require('./cursor.js');
var TerminalInputController = require('./terminal_input_controller.js');
var GravityController = require('./gravity_controller.js');

(function(){

"use strict";
  
function GameController(){
  var _grid = new Grid.Grid();
  var _view = new TerminalGridView.TerminalGridView(_grid);
  var _cursor = new Cursor.Cursor(_grid, _view);
  var _inputController = new TerminalInputController.TerminalInputController(_cursor);
  var _gravityController = new GravityController.GravityController(_grid, _view);
    // this.tileClearController = new TileClearController();
  _view.setInputDelegate(_inputController);
  var _gameAdvanceIntervalInMillis = 5000;
  var advanceGame = function(){
    _grid.advanceRows();
    _view.updateView();
  };
  this.startGame = function(){
    _view.initializeView();
    _cursor.setPosition(0,0);
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