#! /usr/local/bin/node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gridModule = require('../grid.js');
var terminalGridModule = require('../terminal_grid.js');

describe('TerminalGridView', function(){
  it('can be created', function(){
    var gridMC = new gridModule.Grid();
    var terminalGrid = new terminalGridModule.TerminalGridView(gridMC);
  });
});

describe('TerminalGridView', function(){
  it('requires a valid GridMC', function(){
    var gridMC = new gridModule.Grid();
    var threw = false;
    var realIsValidGrid = gridModule.isValidGrid;
    gridModule.isValidGrid = function(){
      return false;
    };
    try{
      var terminalGrid = new terminalGridModule.TerminalGridView(gridMC);
    } catch (e){
      threw = true;
    } finally{
      assert(threw);
      gridModule.isValidGrid = realIsValidGrid;
    }
  });
});

describe('displayGrid', function(){
  it('calls console.log at least once for each line', function(){
    var gridMC = new gridModule.Grid();
    var terminalGrid = new terminalGridModule.TerminalGridView(gridMC);
    var realConsoleLog = console.log;
    var callsToConsoleLog = 0;
    console.log = function(){
      callsToConsoleLog += 1;
    };
    try {
      terminalGrid.displayGrid();
    }
    finally {
      console.log = realConsoleLog;
      assert(gridMC.height <= callsToConsoleLog);
    }
  });
});