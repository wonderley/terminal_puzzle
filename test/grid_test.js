var assert = require('assert');
var game_grid = require('../grid.js');
var my_grid = new game_grid.Grid();

describe('grid', function(){
  it('should have height and width', function(){
    assert(my_grid.height !== undefined);
    assert(my_grid.width !== undefined);
  });
});

describe('grid', function(){
  it('height should default to 16', function(){
    assert(my_grid.height === 16);
  });
});
     
describe('grid', function(){
  it('width should default to 8', function(){
    assert(my_grid.width === 8);
  });
});

describe('grid', function(){
  it('should allow access to tiles', function(){
    assert(my_grid.tileAt(0, 0) !== undefined);
  });
});

describe('grid', function(){
  it('should throw exception if I access tile with x too big', function(){
    var height = my_grid.height;
    var width = my_grid.width;
    var threw = false;
    try {
      my_grid.tileAt(width, 0);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
});

describe('grid', function(){
  it('should throw exception if I access tile with y too big', function(){
    var height = my_grid.height;
    var width = my_grid.width;
    var threw = false;
    try {
      my_grid.tileAt(0, height);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
});

describe('grid', function(){
  it('should throw exception if I access tile with negative x', function(){
    var height = my_grid.height;
    var width = my_grid.width;
    var threw = false;
    try {
      my_grid.tileAt(-1, 0);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
});

describe('grid', function(){
  it('should throw exception if I access tile with negative y', function(){
    var height = my_grid.height;
    var width = my_grid.width;
    var threw = false;
    try {
      my_grid.tileAt(0, -1);
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });
});

describe('grid', function(){
  it('should allow access to all valid tiles', function(){
    for(var x = 0; x < my_grid.width; ++x){
      for(var y = 0; y < my_grid.height; ++y){
        var tile = my_grid.tileAt(x, y);
        assert(tile !== undefined);
      }
    }
  });
});

describe('grid', function(){
  it('should start with all tiles unoccupied', function(){
    for(var x = 0; x < my_grid.width; ++x){
      for(var y = 0; y < my_grid.height; ++y){
        var tile = my_grid.tileAt(x, y);
        assert(tile.state === game_grid.TileState.EMPTY);
      }
    }
  });
});

describe('grid', function(){
  it('can have its rows advanced', function(){
    assert(my_grid.advanceRows !== undefined);
  });
});

describe('grid', function(){
  it('has bottom row occupied after row is advanced', function(){
    var grid = new game_grid.Grid();
    grid.advanceRows();
    for(var x = 0; x < grid.width; ++x){
      var tile = grid.tileAt(x, grid.height - 1);
      assert(tile.state !== game_grid.TileState.EMPTY);
    }
  });
});

describe('grid', function(){
  it('shifts all rows up by one when rows are advanced', function(){
    var grid = new game_grid.Grid();
    var original_grid = [];
    for(var y = 0; y < grid.height; ++y){
      var row = [];
      for(var x = 0; x < grid.width; ++x){
        var tile = grid.tileAt(x, y);
        row.push(tile);
      }
      original_grid.push(row);
    }
    grid.advanceRows();
    original_grid.forEach(function(row, y){
      if (y === 0) {
        // Top row is gone
        return;
      }
      row.forEach(function(tile, x){
        var sameTileInNewPosition = grid.tileAt(x, y-1);
        assert(tile.id === sameTileInNewPosition.id);
      });
    });
  });
});

describe('randomOccupiedTileState', function(){
  it('only returns valid occupied tile states', function(){
    for (var i = 0; i < 100; ++i){
      var randomState = game_grid.randomOccupiedTileState();
      assert(randomState > game_grid.TileState.EMPTY);
      assert(randomState < game_grid.TileState.COUNT);
    }
  });
});

