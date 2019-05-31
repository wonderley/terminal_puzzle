#! /usr/bin/env node
import { Grid, Tile, TileState } from './grid';

/**
 * Searches the grid for tiles that should be cleared.
 * \return true if any tiles were marked to clear.
 */
export class TileClearController {
  constructor(private _grid: Grid) {}
  public markTilesToClear() {
    var somethingWasMarked = false;
    var markEachTile = function(_: any, idx: number, arr: Tile[]){
      arr[idx].markedToClear = true;
    };
    var currentState = TileState.EMPTY;
    var consecutiveTiles: any[] = [];
    function markConsecutiveTilesInArray(tile: Tile, idx: number, arr: Tile[]){
      if (tile.state !== TileState.EMPTY &&
          tile.state === currentState){
        consecutiveTiles.push(tile);
      } else {
        if (consecutiveTiles.length >= 3){
          somethingWasMarked = true;
          consecutiveTiles.forEach(markEachTile);
        }
        consecutiveTiles = [tile];
      }
      if (idx === arr.length - 1){
        // Handle the last item
        if (consecutiveTiles.length >= 3){
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
    for (var y = 0; y < Grid.rowCount - 1; ++y){
      this._grid.rowAt(y).forEach(markConsecutiveTilesInArray);
    }
    for (var x = 0; x < Grid.columnCount; ++x){
      this._grid.columnAt(x).slice(0, Grid.rowCount - 1).forEach(markConsecutiveTilesInArray);
    }
    return somethingWasMarked;
  };
  clearMarkedTiles() {
    function clearTileIfMarked(tile: Tile){
      if (tile.markedToClear){
        tile.state = TileState.EMPTY;
        tile.markedToClear = false;
      }
    }
    for (var y = 0; y < Grid.rowCount; ++y){
      this._grid.rowAt(y).forEach(clearTileIfMarked);
    }
  };
}
