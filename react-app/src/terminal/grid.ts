import { Tile, TileState } from './tile';
import { GridComponent } from '../components/GridComponent';

export class Grid {
  // private
  private _rows: Tile[][] = [];
  public static readonly ROW_COUNT: number = 12;
  public static readonly COLUMN_COUNT: number = 6;
  constructor(private _gridComponent: GridComponent) {
    for (let i = 0; i < Grid.ROW_COUNT; ++i) {
      this.addEmptyRow();
    }
  }
  private addEmptyRow() {
    let row = [];
    for (let j = 0; j < Grid.COLUMN_COUNT; ++j) {
      const tile = new Tile(TileState.EMPTY);
      row.push(tile);
    }
    this._rows.push(row);
  }
  private addPopulatedRow() {
    let row = this.generateRandomRow();
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
    let row = [];
    // for (let j = 0; j < Grid.COLUMN_COUNT; ++j) {
    //   const tileStateNum = j % 4;
    //   const state: TileState = Tile.NONEMPTY_STATES[tileStateNum];
    //   row.push(new Tile(state));
    // }
    let lastTileState = {
      state: TileState.EMPTY,
      count: 0
    };

    for (let j = 0; j < Grid.COLUMN_COUNT; ++j) {
      let tile = new Tile(TileState.EMPTY);
      let allowedStates = Tile.NONEMPTY_STATES;
      if (lastTileState.count >= 2) {
        // Remove the state from the list of the allowed states
        allowedStates = allowedStates
          .filter(s => s !== lastTileState.state);
      }
      tile.state = this.randomOccupiedTileState(allowedStates);
      if (tile.state === lastTileState.state) {
        lastTileState.count += 1;
      } else {
        lastTileState.state = tile.state;
        lastTileState.count = 1;
      }
      row.push(tile);
    }
    return row;
  }
  tileAt(x: number, y: number) {
    if (x >= Grid.COLUMN_COUNT ||
        y >= Grid.ROW_COUNT ||
        x < 0 ||
        y < 0) {
      throw 'out of bounds';
    }
    return this._rows[y][x];
  }
  rowAt(y: number) {
    if (y >= Grid.ROW_COUNT || y < 0) {
      throw new Error('out of bounds');
    }
    return this._rows[y];
  }
  columnAt(x: number) {
    let column = [];
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      column.push(this.tileAt(x, y));
    }
    return column;
  }
  swapTilesAt(x1: number, y1: number, x2: number, y2: number) {
    let tile1 = this._rows[y1][x1];
    this._rows[y1][x1] = this._rows[y2][x2];
    this._rows[y2][x2] = tile1;
  }
  advanceRowsSmall() {
    this.currentSubrow = (this.currentSubrow + 1) % this.subrowsPerRow;
    if (this.currentSubrow > 0) { 
      // todo GameController.instance.onGridChanged();
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
    let topRow = this._rows[0];
    for (let i = 0; i < topRow.length; ++i) {
      let topTile = topRow[i];
      if (topTile.state !== TileState.EMPTY) {
        // todo this._gridComponent.onGameOver();
        return;
      }
    }
    this.removeRow();
    // todo GameController.instance.onGridChanged();
  }

  randomOccupiedTileState(allowedStates: TileState[]) {
    let randomFloat = Math.random() * (allowedStates.length);
    let tileIndex = Math.floor(randomFloat);
    return allowedStates[tileIndex];
  }
}
