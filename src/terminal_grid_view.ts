#! /usr/bin/env node
import { Grid, Tile, TileState } from './grid';
import { InputDelegate } from './input_delegate';
var blessed = require('blessed');

export class TerminalGridView {
  public static readonly tileWidth: number = 4;
  public static readonly tileHeight: number = 3;
  public static readonly widthBetweenTiles: number = 2;
  // note - TerminalGridView.heightBetweenTiles and TerminalGridView.tileHeight should add to
  // Grid subrowsPerRow - 1.
  public static readonly heightBetweenTiles = 1;
  // Create a screen object.
  private _screen: any = null;
  private _rows: any = [];
  // The UI elements that collectively make up the cursor
  private _cursorBox: any = null;
  private _inputDelegate: any = null;
  currentSubrow: number = 0;
  constructor(private readonly _gridMC: Grid) {
  }

  private colorForTile(tile: Tile, isBottomRow: boolean) {
    if (tile.markedToClear){
      return 'black';
    }
    var light = isBottomRow ? '' : 'light ';
    var tileState = tile.state;
    if (tileState === TileState.EMPTY){
      return 'default';
    } else if (tileState === TileState.A){
      return light + 'green';
    } else if (tileState === TileState.B){
      return light + 'blue';
    } else if (tileState === TileState.C){
      return light + 'magenta';
    } else if (tileState === TileState.D){
      return light + 'red';
    }
    throw 'Invalid TileState.';
  }

  private registerKeys() {
    const that: TerminalGridView = this;
    this._screen.on('keypress', function(_: any, key: { full: string }) {
      if (key) {
        that._inputDelegate.onUserInput(key);
      }
    });
  }

  initializeView() {
    this._screen = blessed.screen();
    
    var inner = blessed.box({  
      top: 'top',
      left: 'left',
      width: colCount * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles) + 4,
      height: (rowCount + 1) * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles),
      fg: 'default',
      bg: 'default',
      tags: true
    });
    var scoreText = blessed.text({  
      top: '20%',
      left: '50%',
      width: '30%',
      height: 2,
      fg: 'blue',
      bg: 'default',
      content: 'Score: 0'
    });
    
    // Append our box to the screen.
    this._screen.append(inner);
    this._screen.append(scoreText);
    var rowCount = Grid.rowCount;
    var colCount = Grid.columnCount;
    for (var i = 0; i < rowCount; ++i) {
      var y = TerminalGridView.heightBetweenTiles + i * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles);
      var tiles = [];
      for (var j = 0; j < colCount; ++j){
        var x = TerminalGridView.widthBetweenTiles + j * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles);
        var tile = blessed.box({
          top: y,
          left: x,
          width: TerminalGridView.tileWidth,
          height: TerminalGridView.tileHeight,
          fg: 'white',
          bg: 'green'
        });
        tiles.push(tile);
        inner.append(tile);
      }
      this._rows.push(tiles);
    }
    // Add the line above the bottom row.
    var bottomRowMarkerLeft = blessed.box({
      top: (rowCount - 1) * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles),
      left: 0,
      width: 1,
      height: 1,
      fg: 'white',
      bg: 'white'
    });
    var bottomRowMarkerRight = blessed.box({
      top: (rowCount - 1) * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles),
      left: 1 + colCount * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles),
      width: 1,
      height: 1,
      fg: 'white',
      bg: 'white'
    });
    inner.append(bottomRowMarkerLeft);
    inner.append(bottomRowMarkerRight);
    this._screen.render();
    var yloc = 4 * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles);
    var tiles = [];
    var xloc = 4 * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles);
    this._cursorBox = blessed.box({
      top: yloc,
      left: xloc,
      width: TerminalGridView.tileWidth * 2 + TerminalGridView.widthBetweenTiles * 3,
      height: TerminalGridView.tileHeight + 2 * TerminalGridView.heightBetweenTiles,
      fg: 'white',
      bg: 'white'
    });
    inner.append(this._cursorBox);
    this._cursorBox.setBack();
    var bottomRowBlocker = blessed.box({
      top: (Grid.rowCount - 1) * TerminalGridView.tileHeight + Grid.rowCount * TerminalGridView.heightBetweenTiles,
      left: 0,
      width: Grid.columnCount * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles),
      height: TerminalGridView.tileHeight,
      fg: 'default',
      bg: 'default'
    });
    inner.append(bottomRowBlocker);
    this.registerKeys();
    this._gridMC.advanceRows();
    this.updateView();
  };
  updateView() {
    var subrowAdjustment = this.currentSubrow - this._gridMC.currentSubrow;
    this.currentSubrow = this._gridMC.currentSubrow;
    for (var y = 0; y < Grid.rowCount; ++y){
      var isBottomRow = (y === Grid.rowCount - 1);
      for (var x = 0; x < Grid.columnCount; ++x){
        var tile = this._gridMC.tileAt(x,y);
        var tileView = this._rows[y][x];
        var color = this.colorForTile(tile, isBottomRow);
        tileView.style.bg = color;
        tileView.position.top += subrowAdjustment;
      }
    }
    this._cursorBox.position.top += subrowAdjustment;
    // Render the screen.
    this._screen.render();
  };
  drawCursorAt(x: number, y: number){
    var xloc = x * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles);
    var yloc = y * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles) - this.currentSubrow;
    this._cursorBox.position.top = yloc;
    this._cursorBox.position.left = xloc;
    this._screen.render();
  };
  clearCursorAt(x: number, y: number) {
    var tileView = this._rows[y][x];
    var tileView2 = this._rows[y][x+1];
  };
  setInputDelegate(inputDelegate: InputDelegate) {
    this._inputDelegate = inputDelegate;
  };
}
  
if (require.main === module) {
  var grid = new Grid();
  var view = new TerminalGridView(grid);
  view.initializeView();
  setInterval(function(){
    grid.advanceRows();
    view.updateView();
  }, 2000);
}
