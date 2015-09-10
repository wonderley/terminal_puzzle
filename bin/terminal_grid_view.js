#! /usr/bin/env node
var Grid = require('./grid.js');
var blessed = require('blessed');
var InputDelegate = require('./input_delegate.js');

(function(){

"use strict";

var tileWidth = 4;
var tileHeight = 2;
var widthBetweenTiles = 2;
var heightBetweenTiles = 1;  
function TerminalGridView(gridMC){
  if (!Grid.isValidGrid(gridMC)){
    throw 'Not a valid Grid.';
  }
  var _gridMC = gridMC;
  // Create a screen object.
  var _screen = null;
  var _rows = [];
  // The UI elements that collectively make up the cursor
  var _cursorBox = null;
  var _inputDelegate = null;
  var colorForTile = function(tile){
    if (tile.markedToClear){
      return 'black';
    }
    var tileState = tile.state;
    if (tileState === Grid.TileState.EMPTY){
      return 'default';
    } else if (tileState === Grid.TileState.A){
      return 'green';
    } else if (tileState === Grid.TileState.B){
      return 'red';
    } else if (tileState === Grid.TileState.C){
      return 'blue';
    } else if (tileState === Grid.TileState.D){
      return '#f3f449';
    }
    throw 'Invalid TileState.';
  };
  var registerKeys = function(){
    _screen.on('keypress', function(ch, key){
      if (_inputDelegate && key){
        _inputDelegate.onUserInput(key);
      }
    });
  };
  this.initializeView = function(){
    _screen = blessed.screen();
    
    var inner = blessed.box({  
      top: 'top',
      left: 'left',
      width: '70%',
      height: '100%',
      fg: 'blue',
      bg: 'default',
      tags: true
    });
    
    // Append our box to the screen.
    _screen.append(inner);
    var rowNum = _gridMC.rowCount;
    var colNum = _gridMC.columnCount;
    for (var i = 0; i < rowNum; ++i) {
      var y = heightBetweenTiles + i * (tileHeight + heightBetweenTiles);
      var tiles = [];
      for (var j = 0; j < colNum; ++j){
        var x = widthBetweenTiles + j * (tileWidth + widthBetweenTiles);
        var tile = blessed.box({
          top: y,
          left: x,
          width: tileWidth,
          height: tileHeight,
          fg: 'white',
          bg: 'green'
        });
        tiles.push(tile);
        inner.append(tile);
      }
      _rows.push(tiles);
    }
    _screen.render();
    var yloc = 4 * (tileHeight + heightBetweenTiles);
    var tiles = [];
    var xloc = 4 * (tileWidth + widthBetweenTiles);
    _cursorBox = blessed.box({
      top: yloc,
      left: xloc,
      width: tileWidth * 2 + widthBetweenTiles * 3,
      height: tileHeight + 2 * heightBetweenTiles,
      fg: 'white',
      bg: 'white'
    });
    inner.append(_cursorBox);
    _cursorBox.setBack();
    registerKeys();
    _gridMC.advanceRows();
    this.updateView();
  };
  this.updateView = function(){
    for (var x = 0; x < _gridMC.columnCount; ++x){
      for (var y = 0; y < _gridMC.rowCount; ++y){
        var tile = _gridMC.tileAt(x,y);
        var tileView = _rows[y][x];
        var color = colorForTile(tile);
        tileView.style.bg = color;
      }
    }
    // Render the screen.
    _screen.render();
  };
  this.drawCursorAt = function(x,y){
    var xloc = x * (tileWidth + widthBetweenTiles);
    var yloc = y * (tileHeight + heightBetweenTiles);
    _cursorBox.position.top = yloc;
    _cursorBox.position.left = xloc;
    _screen.render();
  };
  this.clearCursorAt = function(x,y){
    var tileView = _rows[y][x];
    var tileView2 = _rows[y][x+1];
  };
  this.setInputDelegate = function(inputDelegate){
    if (!InputDelegate.isInputDelegate(inputDelegate)){
      throw 'Not an InputDelegate';
    }
    _inputDelegate = inputDelegate;
  };
}
  
function isValidView(view){
  return view instanceof TerminalGridView;
}
  
if (require.main === module) {
  var grid = new Grid.Grid();
  var view = new TerminalGridView(grid);
  view.initializeView();
  setInterval(function(){
    grid.advanceRows();
    view.updateView();
  }, 2000);
}
  
module.exports = {
  TerminalGridView: TerminalGridView,
  isValidView: isValidView
};
  
})();
