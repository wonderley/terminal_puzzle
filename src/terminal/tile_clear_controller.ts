import { Grid } from './grid';
import { Tile, TileState } from './tile';

/**
 * Searches the grid for tiles that should be cleared.
 * \return true if any tiles were marked to clear.
 */
export class TileClearController {
  constructor(private _grid: Grid) {}
  public markTilesToClear() {
    let somethingWasMarked = false;
    let markEachTile = function(_: any, idx: number, arr: Tile[]) {
      arr[idx].markedToClear = true;
    };
    let currentState = TileState.EMPTY;
    let consecutiveTiles: any[] = [];
    function markConsecutiveTilesInArray(tile: Tile, idx: number, arr: Tile[]) {
      if (tile.state !== TileState.EMPTY &&
          tile.state === currentState) {
        consecutiveTiles.push(tile);
      } else {
        if (consecutiveTiles.length >= 3) {
          somethingWasMarked = true;
          consecutiveTiles.forEach(markEachTile);
        }
        consecutiveTiles = [tile];
      }
      if (idx === arr.length - 1) {
        // Handle the last item
        if (consecutiveTiles.length >= 3) {
          somethingWasMarked = true;
          consecutiveTiles.forEach(markEachTile);
        }
        consecutiveTiles = [];
        currentState = TileState.EMPTY;
      }
      else {
        currentState = tile.state;
      }
    }
    // Iterate over each row and each column
    // Exclude the last row from both processes because it's not "in play".
    for (let y = 0; y < Grid.ROW_COUNT - 1; ++y) {
      this._grid.rowAt(y).forEach(markConsecutiveTilesInArray);
    }
    for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
      this._grid.columnAt(x).slice(0, Grid.ROW_COUNT - 1).forEach(markConsecutiveTilesInArray);
    }
    return somethingWasMarked;
  };
  clearMarkedTiles() {
    function clearTileIfMarked(tile: Tile) {
      if (tile.markedToClear) {
        tile.state = TileState.EMPTY;
        tile.markedToClear = false;
      }
    }
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      this._grid.rowAt(y).forEach(clearTileIfMarked);
    }
  };
}
