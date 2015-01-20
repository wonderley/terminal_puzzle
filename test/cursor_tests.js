#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../bin/grid.js');
var terminalGridModule = require('../bin/terminal_grid_view.js');
var gameControllerModule = require('../bin/game_controller.js');
var cursorModule = require('../bin/cursor.js');

describe('Cursor', function(){
  it('can be created', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
  });
});

describe('Cursor', function(){
  it('throws if created with invalid grid', function(){
    var grid = new gridModule.Grid();
    var tmp = gridModule.isValidGrid;
    var view = new terminalGridModule.TerminalGridView(grid);
    gridModule.isValidGrid = function(){
      return false;
    };
    var threw = false;
    try{
      var controller = new cursorModule.Cursor(grid, view);
    }catch(e){
      threw = true;
    } finally {
      gridModule.isValidGrid = tmp;
      assert(threw);
    }
  });
});

describe('Cursor', function(){
  it('throws if created with invalid view', function(){
    var grid = new gridModule.Grid();
    var tmp = terminalGridModule.isValidView;
    var view = new terminalGridModule.TerminalGridView(grid);
    terminalGridModule.isValidView = function(){
      return false;
    };
    var threw = false;
    try{
      var controller = new cursorModule.Cursor(grid, view);
    }catch(e){
      threw = true;
    } finally {
      terminalGridModule.isValidView = tmp;
      assert(threw);
    }
  });
});

describe('Cursor isValidCursorPosition', function(){
  it('returns true if the position is valid on grid and so is the position to the right', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    for (var x = 0; x < grid.width - 1; ++x){
      for (var y = 0; y < grid.height; ++y){
        assert(cursor.isValidCursorPosition(x,y) === true);
      }
    }
  });
});

describe('Cursor isValidCursorPosition', function(){
  it('returns false if the position is invalid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    // Tiles furthest to the right
    for (var y = 0; y < grid.height; ++y){
      assert(cursor.isValidCursorPosition(-1,y) === false);
      assert(cursor.isValidCursorPosition(grid.width,y) === false);
    }
    for (var x = 0; x < grid.width; ++x){
      assert(cursor.isValidCursorPosition(x,-1) === false);
      assert(cursor.isValidCursorPosition(x,grid.height) === false);
    }
  });
});

describe('Cursor isValidCursorPosition', function(){
  it('returns false if the position to the right is invalid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    // Tiles furthest to the right
    for (var y = 0; y < grid.height; ++y){
      assert(cursor.isValidCursorPosition(-2,y) === false);
      assert(cursor.isValidCursorPosition(grid.width - 1,y) === false);
    }
    for (var x = 0; x < grid.width; ++x){
      assert(cursor.isValidCursorPosition(x - 1,-1) === false);
      assert(cursor.isValidCursorPosition(x - 1,grid.height) === false);
    }
  });
});

describe('Cursor', function(){
  it('has x and y that default to -1', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    assert(cursor.getX() === -1);
    assert(cursor.getY() === -1);
  });
});

describe('isValidCursor', function(){
  it('fails if falsy value is passed', function(){
    assert(cursorModule.isValidCursor() === false);
    assert(cursorModule.isValidCursor(null) === false);
    assert(cursorModule.isValidCursor(false) === false);
  });
});

describe('isValidCursor', function(){
  it('succeeds if a valid view and grid are passed', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    assert(cursorModule.isValidCursor(cursor) === true);
  });
});

describe('setPosition', function(){
  it('throws if invalid position', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function(){
      return false;
    };
    var threw = false;
    try{
      cursor.setPosition(0,0);
    } catch (e){
      threw = true;
    } finally {
      assert(threw);
    }
  });
});

describe('setPosition', function(){
  it('sets x and y', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(4,5);
    assert(cursor.getX() === 4);
    assert(cursor.getY() === 5);
  });
});

describe('setPosition', function(){
  it('tells view to draw cursor', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    var drawCursorAtCalled = false;
    view.drawCursorAt = function(){
      drawCursorAtCalled = true;
    };
    cursor.setPosition(4,5);
    assert(drawCursorAtCalled);
  });
});

describe('setPosition', function(){
  it('doesn\'t tell view to clear cursor the first time it\'s called', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    var clearCursorAtCalled = false;
    view.clearCursorAt = function(){
      clearCursorAtCalled = true;
    };
    cursor.setPosition(4,5);
    assert(!clearCursorAtCalled);
  });
});

describe('setPosition', function(){
  it('tells view to clear cursor after first time', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    var clearCursorAtCalled = false;
    view.clearCursorAt = function(){
      clearCursorAtCalled = true;
    };
    cursor.setPosition(2,2);
    cursor.setPosition(4,5);
    assert(clearCursorAtCalled);
  });
});

describe('setPosition', function(){
  it('Doesn\'t tell view to draw cursor if position unchanged', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    var drawCursorAtCalled;
    view.drawCursorAt = function(){
      drawCursorAtCalled = true;
    };
    cursor.setPosition(4,5);
    drawCursorAtCalled = false;
    cursor.setPosition(4,5);
    assert(!drawCursorAtCalled);
  });
});

describe('Cursor goUp', function(){
  it('Sets position up if the position is valid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function(){
      return true;
    };
    cursor.setPosition(1,1);
    cursor.goUp();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 0);
  });
});

describe('Cursor goUp', function(){
  it('Does nothing if the position is not valid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.isValidCursorPosition = function(){
      return false;
    };
    cursor.goUp();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goDown', function(){
  it('Sets position down if the position is valid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function(){
      return true;
    };
    cursor.setPosition(1,1);
    cursor.goDown();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 2);
  });
});

describe('Cursor goDown', function(){
  it('Does nothing if the position is not valid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.isValidCursorPosition = function(){
      return false;
    };
    cursor.goDown();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goLeft', function(){
  it('Sets position left if the position is valid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function(){
      return true;
    };
    cursor.setPosition(1,1);
    cursor.goLeft();
    assert(cursor.getX() === 0);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goLeft', function(){
  it('Does nothing if the position is not valid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.isValidCursorPosition = function(){
      return false;
    };
    cursor.goLeft();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goRight', function(){
  it('Sets position right if the position is valid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function(){
      return true;
    };
    cursor.setPosition(1,1);
    cursor.goRight();
    assert(cursor.getX() === 2);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goRight', function(){
  it('Does nothing if the position is not valid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.isValidCursorPosition = function(){
      return false;
    };
    cursor.goRight();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor swapTiles', function(){
  it('Calls swapTilesAt at the current position', function(){
    var grid = new gridModule.Grid();
    var x1Param = null,
        y1Param = null,
        x2Param = null,
        y2Param = null;
    grid.swapTilesAt = function(x1, y1, x2, y2){
      x1Param = x1;
      y1Param = y1;
      x2Param = x2;
      y2Param = y2;
    };
    var view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    view.updateView = function(){};
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.swapTiles();
    assert(x1Param === 1);
    assert(y1Param === 1);
    assert(x2Param === 2);
    assert(y2Param === 1);
  });
  it('Calls onGridChanged', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    grid.delegate = {};
    view.clearCursorAt = function(){};
    view.drawCursorAt = function(){};
    var onGridChangedCalled = false;
    grid.delegate.onGridChanged = function(){
     onGridChangedCalled = true;
    };
    view.updateView = function(){
    };
    var cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.swapTiles();
    assert(onGridChangedCalled);
  });
});