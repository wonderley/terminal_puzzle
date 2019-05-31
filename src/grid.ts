import { GameController } from './game_controller';

export class Grid {
  // private
  private _rows: any[] = [];
  public static readonly rowCount: number = 12;
  public static readonly columnCount: number = 6;
  constructor() {
    for (var i = 0; i < Grid.rowCount; ++i) {
      this.addEmptyRow();
    }
  }
  private addEmptyRow() {
    var row = [];
    for (var j = 0; j < Grid.columnCount; ++j) {
      var tile = new Tile(0);
      row.push(tile);
    }
    this._rows.push(row);
  }
  private addPopulatedRow() {
    var row = this.generateRandomRow();
    this._rows.push(row);
  }
  private removeRow() {
    this._rows.shift();
  }
  private isNotLastTileState(state: TileState, lastTileState: { state: TileState, count: number }) {
    return state !== lastTileState.state;
  }
  
  // public
  subrowsPerRow: number = 4;
  currentSubrow: number = 0;
  generateRandomRow() {
    var row = [];
    for (let j = 0; j < Grid.columnCount; ++j) {
      const tileStateNum = j % 4 + 1;
      row.push(new Tile(tileStateNum));
    }
    // var lastTileState = {
    //   state: TileState.EMPTY,
    //   count: 0
    // };

    // var allowedStates = TileState.allOccupied();
    // for (var j = 0; j < Grid.columnCount; ++j) {
    //   var tile = new Tile();
    //   if (lastTileState.count >= 2){
    //     // Remove the state from the list of the allowed states
    //     allowedStates = allowedStates.filter(isNotLastTileState);
    //   }
    //   tile.state = module.exports.randomOccupiedTileState(allowedStates);
    //   if (tile.state === lastTileState.state){
    //     lastTileState.count += 1;
    //   } else {
    //     lastTileState.state = tile.state;
    //     lastTileState.count = 1;
    //     allowedStates = TileState.allOccupied();
    //   }
    //   row.push(tile);
    // } lrw
    return row;
  }
  tileAt(x: number, y: number) {
    if (x >= Grid.columnCount ||
        y >= Grid.rowCount ||
        x < 0 ||
        y < 0){
      throw 'out of bounds';
    }
    return this._rows[y][x];
  }
  rowAt(y: number) {
    if (y >= Grid.rowCount ||
        y < 0){
      throw 'out of bounds';
    }
    return this._rows[y];
  }
  columnAt(x: number) {
    var column = [];
    for (var y = 0; y < Grid.rowCount; ++y){
      column.push(this.tileAt(x, y));
    }
    return column;
  }
  swapTilesAt(x1: number, y1: number, x2: number, y2: number) {
    var tile1 = this._rows[y1][x1];
    this._rows[y1][x1] = this._rows[y2][x2];
    this._rows[y2][x2] = tile1;
  }
  advanceRowsSmall() {
    this.currentSubrow = (this.currentSubrow + 1) % this.subrowsPerRow;
    if (this.currentSubrow > 0) { 
      GameController.instance.onGridChanged();
      return;
    }
    else {
      this.advanceRows();
    }
  }
  /**
   * Bring the rows upwards by one and add a new row
   * of occupied tiles to the bottom.
   */
  advanceRows() {
    this.addPopulatedRow();
    var topRow = this._rows[0];
    for (var i = 0; i < topRow.length; ++i) {
      var topTile = topRow[i];
      if (topTile.state !== TileState.EMPTY) {
        GameController.instance.onGameOver();
        return;
      }
    }
    this.removeRow();
    GameController.instance.onGridChanged();
  };
}

// lrw this.populate();
export enum TileState {
  EMPTY,
  A,
  B,
  C,
  D,
}

export class Tile {
  public static __tileCount = 0;
  public state: TileState;
  // stateNum is an easy way to provide a TileState.
  // Can be any integer.
  constructor(stateNum: number) {
    if (stateNum === 0) {
      this.state = TileState.EMPTY;
    } else if (stateNum === 1) {
      this.state = TileState.A;
    } else if (stateNum === 2) {
      this.state = TileState.B;
    } else if (stateNum === 3) {
      this.state = TileState.C;
    } else if (stateNum === 4) {
      this.state = TileState.D;
    }
    Tile.__tileCount += 1;
  }
  id: number;
  markedToClear: boolean;
}
  
// function randomOccupiedTileState(allowedStates){
//   if (!Array.isArray(allowedStates)||
//       allowedStates.length === 0){
//     throw 'Did not pass an array of allowed states.';
//   }
//   allowedStates.forEach(function(state){
//     if (state <= TileState.EMPTY || state >= TileState.COUNT){
//       throw 'Invalid tile state';
//     }
//   });
//   var randomFloat = Math.random() * (allowedStates.length);
//   var tileIndex = Math.floor(randomFloat);
//   return allowedStates[tileIndex];
// }
