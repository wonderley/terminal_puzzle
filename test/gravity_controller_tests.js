#! /usr/bin/env node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var gravityControllerModule = require('../src/gravity_controller.js');
var terminalGridModule = require('../src/terminal_grid_view.js');
var gridModule = require('../src/grid.js');

describe('GravityController', function(){
  it('can be created', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var controller = new gravityControllerModule.GravityController(grid, view);
  });
  it('must be created with a valid grid', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var tmp = gridModule.isValidGrid;
    gridModule.isValidGrid = function(){
      return false;
    };
    var threw = false;
    try{
      var controller = new gravityControllerModule.GravityController(grid, view);
    } catch (e){
      threw = true;
    } finally {
      gridModule.isValidGrid = tmp;
      assert(threw);
    }
  });
  it('must be created with a valid view', function(){
    var grid = new gridModule.Grid();
    var tmp = terminalGridModule.isValidView;
    var view = new terminalGridModule.TerminalGridView(grid);
    terminalGridModule.isValidView = function(){
      return false;
    };
    var threw = false;
    try{
      var controller = new gravityControllerModule.GravityController(grid, view);
    }catch(e){
      threw = true;
    } finally {
      terminalGridModule.isValidView = tmp;
      assert(threw);
    }
  });
});

describe('GravityController applyGravity', function(){
  it('drops single tiles with empty tiles below them to the bottom', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var controller = new gravityControllerModule.GravityController(grid, view);
    var tile1 = grid.tileAt(2, 2);
    var tile2 = grid.tileAt(3, 3);
    var tile3 = grid.tileAt(4, 4);
    var tile4 = grid.tileAt(5, 5);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.B;
    tile3.state = gridModule.TileState.C;
    tile4.state = gridModule.TileState.D;
    controller.applyGravity();
    assert(grid.tileAt(2, grid.rowCount - 1) === tile1);
    assert(grid.tileAt(2, 2).state === gridModule.TileState.EMPTY);
    assert(grid.tileAt(3, grid.rowCount - 1) === tile2);
    assert(grid.tileAt(3, 3).state === gridModule.TileState.EMPTY);
    assert(grid.tileAt(4, grid.rowCount - 1) === tile3);
    assert(grid.tileAt(4, 4).state === gridModule.TileState.EMPTY);
    assert(grid.tileAt(5, grid.rowCount - 1) === tile4);
    assert(grid.tileAt(5, 5).state === gridModule.TileState.EMPTY);
  });
  it('drops tiles in same column to the bottom', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var controller = new gravityControllerModule.GravityController(grid, view);
    var tile1 = grid.tileAt(2, 2);
    var tile2 = grid.tileAt(2, 3);
    tile1.state = gridModule.TileState.A;
    tile2.state = gridModule.TileState.B;
    controller.applyGravity();
    assert(grid.tileAt(2, grid.rowCount - 2) === tile1);
    assert(grid.tileAt(2, 2).state === gridModule.TileState.EMPTY);
    assert(grid.tileAt(2, grid.rowCount - 1) === tile2);
    assert(grid.tileAt(2, 3).state === gridModule.TileState.EMPTY);
  });
  it('drops tiles in same column with space between them to the bottom', function(){
    var grid = new gridModule.Grid();
    var view = new terminalGridModule.TerminalGridView(grid);
    var controller = new gravityControllerModule.GravityController(grid, view);
    var tile1 = grid.tileAt(4, 3);
    var tile2 = grid.tileAt(4, 6);
    tile1.state = gridModule.TileState.C;
    tile2.state = gridModule.TileState.D;
    controller.applyGravity();
    assert(grid.tileAt(4, grid.rowCount - 2) === tile1);
    assert(grid.tileAt(4, 3).state === gridModule.TileState.EMPTY);
    assert(grid.tileAt(4, grid.rowCount - 1) === tile2);
    assert(grid.tileAt(4, 6).state === gridModule.TileState.EMPTY);
  });
});
