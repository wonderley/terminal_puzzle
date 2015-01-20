#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../bin/grid.js');
var terminalGridModule = require('../bin/terminal_grid_view.js');
var cursorModule = require('../bin/cursor.js');
var inputDelegateModule = require('../bin/input_delegate.js');

describe('TerminalGridView', function(){
  it('can be created', function(){
    var gridMC = new gridModule.Grid();
    var terminalGrid = new terminalGridModule.TerminalGridView(gridMC);
  });
  it('requires a valid GridMC', function(){
    var gridMC = new gridModule.Grid();
    var threw = false;
    var realIsValidGrid = gridModule.isValidGrid;
    gridModule.isValidGrid = function(){
      return false;
    };
    try {
      var terminalGrid = new terminalGridModule.TerminalGridView(gridMC);
    } catch (e){
      threw = true;
    } finally{
      assert(threw);
      gridModule.isValidGrid = realIsValidGrid;
    }
  });
});

describe('TerminalGridView isValidView', function(){
  it('fails if falsy value is passed', function(){
    assert(terminalGridModule.isValidView() === false);
    assert(terminalGridModule.isValidView(null) === false);
    assert(terminalGridModule.isValidView(false) === false);
  });
  it('succeeds if a valid view is passed', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    assert(terminalGridModule.isValidView(view) === true);
  });
});

describe('TerminalGridView drawCursorAt', function(){
  it('can draw a Cursor', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    assert(view.drawCursorAt !== undefined);
  });
});

describe('TerminalGridView clearCursorAt', function(){
  it('can clear a Cursor', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var cursor = new cursorModule.Cursor(grid, view);
    assert(view.clearCursorAt !== undefined);
  });
});

describe('TerminalGridView setInputDelegate', function(){
  it('throws if argument is not an InputDelegate', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var throwCount = 0;
    try{
      view.setInputDelegate();
    }
    catch (e){
      throwCount += 1;
    }
    try{
      view.setInputDelegate({});
    }
    catch (e){
      throwCount += 1;
    }
    try{
      view.setInputDelegate(true);
    }
    catch (e){
      throwCount += 1;
    }
    try{
      view.setInputDelegate(function(){});
    }
    catch (e){
      throwCount += 1;
    }
    assert(throwCount, 4);
  });
  it('does not throw if argument is an InputDelegate', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var tmp = inputDelegateModule.isInputDelegate;
    inputDelegateModule.isInputDelegate = function(){
      return true;
    };
    var threw = false;
    try{
      view.setInputDelegate({});
    }
    catch (e){
      threw = true;
    }
    finally{
      inputDelegateModule.isInputDelegate = tmp;
      assert(threw === false);
    }
  });
});
