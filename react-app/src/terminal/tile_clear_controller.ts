import { Grid } from '../components/Grid';
import { TileProps, TILE_TYPE_EMPTY, TILE_TYPE_MARKED } from '../components/Tile';

/**
 * Searches the grid for tiles that should be cleared.
 * \return true if any tiles were marked to clear.
 */
export class TileClearController {
  constructor(private _grid: Grid) {}

  // Find any tiles that need to be cleared.
  // Return true if any tiles are marked.
  public markTilesToClear(): boolean {
    const that = this;
    let somethingWasMarked = false;
    let currentType = TILE_TYPE_EMPTY;
    let consecutiveTiles: any[] = [];
    function markConsecutiveTilesInArray(tile: TileProps, idx: number, arr: TileProps[]) {
      if (tile.tileType !== TILE_TYPE_EMPTY &&
          tile.tileType === currentType) {
        consecutiveTiles.push(tile);
      } else {
        if (consecutiveTiles.length >= 3) {
          somethingWasMarked = true;
          consecutiveTiles.forEach(that._markTile);
        }
        consecutiveTiles = [tile];
      }
      if (idx === arr.length - 1) {
        // Handle the last item
        if (consecutiveTiles.length >= 3) {
          somethingWasMarked = true;
          consecutiveTiles.forEach(that._markTile);
        }
        consecutiveTiles = [];
        currentType = TILE_TYPE_EMPTY;
      }
      else {
        currentType = tile.tileType;
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
  }

  clearMarkedTiles() {
    const that = this;
    function clearTileIfMarked(tile: TileProps) {
      if (tile.tileType === TILE_TYPE_MARKED) {
        that._grid.updateTile(tile, {
          tileType: 'empty',
        });
      }
    }
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      this._grid.rowAt(y).forEach(clearTileIfMarked);
    }
  }

  private _markTile(tile: TileProps) {
    this._grid.updateTile(tile, { tileType: 'marked' });
  }
}
