import { Grid } from '../components/Grid';
import { Tile, TILE_TYPE_EMPTY } from '../components/Tile';

/**
 * Searches the grid for tiles that should be cleared.
 * \return true if any tiles were marked to clear.
 */
export class TileClearController {
  constructor(private _grid: Grid) {}
  public markTilesToClear() {
    let somethingWasMarked = false;
    function markEachTile(_: any, idx: number, arr: Tile[]) {
      arr[idx].setState({ markedToClear: true });
    };
    let currentType = TILE_TYPE_EMPTY;
    let consecutiveTiles: any[] = [];
    function markConsecutiveTilesInArray(tile: Tile, idx: number, arr: Tile[]) {
      if (tile.state.tileType !== TILE_TYPE_EMPTY &&
          tile.state.tileType === currentType) {
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
        currentType = TILE_TYPE_EMPTY;
      }
      else {
        currentType = tile.state.tileType;
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
      if (tile.state.markedToClear) {
        tile.setState({
          tileType: 'empty',
          markedToClear: false,
        });
      }
    }
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      this._grid.rowAt(y).forEach(clearTileIfMarked);
    }
  };
}
