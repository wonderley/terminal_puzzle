/* Run with mocha */
/* global require, describe, it */
let assert = require('assert');
let gridModule = require('../../src/terminal/grid.js');
let terminalGridModule = require('../../src/terminal/terminal_grid_view.js');
let GameController = require('../../src/terminal/game_controller.js').GameController;
let cursorModule = require('../../src/terminal/cursor.js');

describe('Cursor', function() {
  it('can be created', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
  });
});

describe('Cursor isValidCursorPosition', function() {
  it('returns true if the position is valid on grid and so is the position to the right', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    for (let x = 0; x < grid.COLUMN_COUNT - 1; ++x) {
      for (let y = 0; y < grid.ROW_COUNT - 1; ++y) {
        assert(cursor.isValidCursorPosition(x,y) === true);
      }
    }
  });
  it('returns false if the position is on the bottom row', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    for (let x = 0; x < grid.COLUMN_COUNT - 1; ++x) {
      assert(cursor.isValidCursorPosition(x, grid.ROW_COUNT - 1) === false);
    }
  });
  it('returns false if the position is on the rightmost column', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    for (let y = 0; y < grid.ROW_COUNT - 1; ++y) {
      assert(cursor.isValidCursorPosition(grid.COLUMN_COUNT - 1, y) === false);
    }
  });
});

describe('Cursor isValidCursorPosition', function() {
  it('returns false if the position is invalid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    // Tiles furthest to the right
    for (let y = 0; y < grid.ROW_COUNT; ++y) {
      assert(cursor.isValidCursorPosition(-1,y) === false);
      assert(cursor.isValidCursorPosition(grid.COLUMN_COUNT,y) === false);
    }
    for (let x = 0; x < grid.COLUMN_COUNT; ++x) {
      assert(cursor.isValidCursorPosition(x,-1) === false);
      assert(cursor.isValidCursorPosition(x,grid.ROW_COUNT) === false);
    }
  });
});

describe('Cursor isValidCursorPosition', function() {
  it('returns false if the position to the right is invalid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    // Tiles furthest to the right
    for (let y = 0; y < grid.ROW_COUNT; ++y) {
      assert(cursor.isValidCursorPosition(-2,y) === false);
      assert(cursor.isValidCursorPosition(grid.COLUMN_COUNT - 1,y) === false);
    }
    for (let x = 0; x < grid.COLUMN_COUNT; ++x) {
      assert(cursor.isValidCursorPosition(x - 1,-1) === false);
      assert(cursor.isValidCursorPosition(x - 1,grid.ROW_COUNT) === false);
    }
  });
});

describe('Cursor', function() {
  it('has x and y that default to -1', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    assert(cursor.getX() === -1);
    assert(cursor.getY() === -1);
  });
});

describe('setPosition', function() {
  it('throws if invalid position', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function() {
      return false;
    };
    let threw = false;
    try{
      cursor.setPosition(0,0);
    } catch (e) {
      threw = true;
    } finally {
      assert(threw);
    }
  });
});

describe('setPosition', function() {
  it('sets x and y', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(4,5);
    assert(cursor.getX() === 4);
    assert(cursor.getY() === 5);
  });
});

describe('setPosition', function() {
  it('tells view to draw cursor', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    let drawCursorAtCalled = false;
    view.drawCursorAt = function() {
      drawCursorAtCalled = true;
    };
    cursor.setPosition(4,5);
    assert(drawCursorAtCalled);
  });
});

describe('setPosition', function() {
  it('doesn\'t tell view to clear cursor the first time it\'s called', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    let clearCursorAtCalled = false;
    view.clearCursorAt = function() {
      clearCursorAtCalled = true;
    };
    cursor.setPosition(4,5);
    assert(!clearCursorAtCalled);
  });
});

describe('setPosition', function() {
  it('tells view to clear cursor after first time', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    let clearCursorAtCalled = false;
    view.clearCursorAt = function() {
      clearCursorAtCalled = true;
    };
    cursor.setPosition(2,2);
    cursor.setPosition(4,5);
    assert(clearCursorAtCalled);
  });
});

describe('setPosition', function() {
  it('Doesn\'t tell view to draw cursor if position unchanged', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    let drawCursorAtCalled;
    view.drawCursorAt = function() {
      drawCursorAtCalled = true;
    };
    cursor.setPosition(4,5);
    drawCursorAtCalled = false;
    cursor.setPosition(4,5);
    assert(!drawCursorAtCalled);
  });
});

describe('Cursor goUp', function() {
  it('Sets position up if the position is valid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function() {
      return true;
    };
    cursor.setPosition(1,1);
    cursor.goUp();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 0);
  });
});

describe('Cursor goUp', function() {
  it('Does nothing if the position is not valid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.isValidCursorPosition = function() {
      return false;
    };
    cursor.goUp();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goDown', function() {
  it('Sets position down if the position is valid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function() {
      return true;
    };
    cursor.setPosition(1,1);
    cursor.goDown();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 2);
  });
});

describe('Cursor goDown', function() {
  it('Does nothing if the position is not valid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.isValidCursorPosition = function() {
      return false;
    };
    cursor.goDown();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goLeft', function() {
  it('Sets position left if the position is valid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function() {
      return true;
    };
    cursor.setPosition(1,1);
    cursor.goLeft();
    assert(cursor.getX() === 0);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goLeft', function() {
  it('Does nothing if the position is not valid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.isValidCursorPosition = function() {
      return false;
    };
    cursor.goLeft();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goRight', function() {
  it('Sets position right if the position is valid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.isValidCursorPosition = function() {
      return true;
    };
    cursor.setPosition(1,1);
    cursor.goRight();
    assert(cursor.getX() === 2);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor goRight', function() {
  it('Does nothing if the position is not valid', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.isValidCursorPosition = function() {
      return false;
    };
    cursor.goRight();
    assert(cursor.getX() === 1);
    assert(cursor.getY() === 1);
  });
});

describe('Cursor swapTiles', function() {
  it('Calls swapTilesAt at the current position', function() {
    let grid = new gridModule.Grid();
    let x1Param = null,
        y1Param = null,
        x2Param = null,
        y2Param = null;
    grid.swapTilesAt = function(x1, y1, x2, y2) {
      x1Param = x1;
      y1Param = y1;
      x2Param = x2;
      y2Param = y2;
    };
    let view = new terminalGridModule.TerminalGridView(grid);
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    view.updateView = function() {};
    GameController.instance.view = view;
    let cursor = new cursorModule.Cursor(grid, view);
    cursor.setPosition(1,1);
    cursor.swapTiles();
    assert(x1Param === 1);
    assert(y1Param === 1);
    assert(x2Param === 2);
    assert(y2Param === 1);
  });
  it('Calls onGridChanged', function() {
    let grid = new gridModule.Grid();
    let view = new terminalGridModule.TerminalGridView(grid);
    grid.delegate = {};
    view.clearCursorAt = function() {};
    view.drawCursorAt = function() {};
    let onGridChangedCalled = false;
    let realOnGridChanged = GameController.instance.onGridChanged;
    try {
      GameController.instance.onGridChanged = function() {
        onGridChangedCalled = true;
      };
      view.updateView = function() {
      };
      let cursor = new cursorModule.Cursor(grid, view);
      cursor.setPosition(1,1);
      cursor.swapTiles();
      assert(onGridChangedCalled);
    }
    finally {
      GameController.instance.onGridChanged = realOnGridChanged;
    }
  });
});
