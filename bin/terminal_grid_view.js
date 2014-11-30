#! /usr/local/bin/node
var Grid = require('./grid.js');
var blessed = require('blessed');
var InputDelegate = require('./input_delegate.js');

(function(){

"use strict";
  
function TerminalGridView(gridMC){
  if (!Grid.isValidGrid(gridMC)){
    throw 'Not a valid Grid.';
  }
  var _gridMC = gridMC;
  // Create a screen object.
  var _screen = null;
  var _rows = [];
  var _inputDelegate = null;
  var colorForTileState = function(tileState){
    if (tileState === Grid.TileState.EMPTY){
      return 'default';
    } else if (tileState === Grid.TileState.A){
      return 'green';
    } else if (tileState === Grid.TileState.B){
      return 'red';
    } else if (tileState === Grid.TileState.C){
      return 'blue';
    } else if (tileState === Grid.TileState.D){
      return 'black';
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
    // Create a box perfectly centered horizontally and vertically.
    var outer = blessed.box({  
      fg: 'blue',
      bg: 'default',
      border: {
        type: 'line',
        fg: '#ffffff'
      },
      tags: true,
      width: '95%',
      height: '95%',
      top: 'center',
      left: 'center'
    });
    // Append our box to the screen.
    _screen.append(outer);
    
    // Create a child box perfectly centered horizontally and vertically.
    var inner = blessed.box({  
      parent: outer,
      top: 'top',
      left: 'left',
      width: '70%',
      height: '100%',
      border: {
        type: 'line',
        fg: '#ffffff'
      },
      fg: 'blue',
      bg: 'default',
      tags: true
    });
    
    var rowNum = _gridMC.height;
    var rowHeightPercent = 100.0 / rowNum;
    var colNum = _gridMC.width;
    var colWidthPercent = 100.0 / colNum;
    for (var i = 0; i < rowNum; ++i) {
      var y = (i * rowHeightPercent) + '%';
      var row = blessed.box({
        top: y,
        left: 'left',
        width: '100%',
        height: rowHeightPercent + '%',
          border: {
            fg: '#ffffff',
          },
      });
      var tiles = [];
      for (var j = 0; j < colNum; ++j){
        var x = (j * colWidthPercent) + '%';
        var tile = blessed.box({
          top: 'top',
          left: x,
          width: colWidthPercent + '%',
          height: '100%',
          border: {
            fg: '#ffffff',
          },
          fg: 'white',
          bg: 'green'
        });
        tiles.push(tile);
        row.append(tile);
      }
      _rows.push(tiles);
      inner.append(row);
    }
    registerKeys();
    _gridMC.advanceRows();
    this.updateView();
  };
  this.updateView = function(){
    for (var x = 0; x < _gridMC.width; ++x){
      for (var y = 0; y < _gridMC.height; ++y){
        var tile = _gridMC.tileAt(x,y);
        var tileView = _rows[y][x];
        var color = colorForTileState(tile.state);
        tileView.style.bg = color;
      }
    }
    // Render the screen.
    _screen.render();
  };
  this.drawCursorAt = function(x,y){
    var tileView = _rows[y][x];
    var tileView2 = _rows[y][x+1];
    tileView.border = {
      fg: 'black',
      type: 'line'
    };
    tileView2.border = tileView.border;
    _screen.render();
  };
  this.clearCursorAt = function(x,y){
    var tileView = _rows[y][x];
    var tileView2 = _rows[y][x+1];
    tileView.border = {
      fg: '#ffffff'
    };
    tileView2.border = tileView.border;
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