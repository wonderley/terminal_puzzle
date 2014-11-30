#! /usr/local/bin/node
/* Run with mocha */
/* global require, describe, it */
var assert = require('assert');
var tileClearControllerModule = require('../bin/tile_clear_controller.js');
var gridModule = require('../bin/grid.js');

describe('TileClearController', function(){
  it('can be created', function(){
    var grid = new gridModule.Grid();
    var controller = new tileClearControllerModule.TileClearController(grid);
  });
  it('must be created with a valid grid', function(){
    var grid = new gridModule.Grid();
    var tmp = gridModule.isValidGrid;
    gridModule.isValidGrid = function(){
      return false;
    };
    var threw = false;
    try{
      var controller = new tileClearControllerModule.TileClearController(grid);
    } catch (e){
      threw = true;
    } finally {
      gridModule.isValidGrid = tmp;
      assert(threw);
    }
  });
});