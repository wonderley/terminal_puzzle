import { Grid } from '../components/Grid';
import { Tile, TILE_TYPE_EMPTY, TILE_TYPE_MARKED } from '../components/Tile';

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
    function markTiles(tiles: Tile[]) {
      that._grid.props.addPoints(
        consecutiveTiles.reduce((total, _, i) => {
          // Award one point for each of the first three tiles.
          // For each additional tile, award 2, then 3, then 4...
          const nextValue = i <= 2 ? 1 : i - 1;
          return total + nextValue;
        }, 0)
      );
      tiles.forEach(tile => tile.setState({ tileType: 'marked' }));
    }
    let somethingWasMarked = false;
    let currentType = TILE_TYPE_EMPTY;
    let consecutiveTiles: Tile[] = [];
    function markConsecutiveTilesInArray(tile: Tile, idx: number, arr: Tile[]) {
      if (tile.state.tileType !== TILE_TYPE_EMPTY &&
          tile.state.tileType !== TILE_TYPE_MARKED &&
          tile.state.tileType === currentType) {
        consecutiveTiles.push(tile);
      } else {
        if (consecutiveTiles.length >= 3) {
          somethingWasMarked = true;
          markTiles(consecutiveTiles);
        }
        consecutiveTiles = [tile];
      }
      if (idx === arr.length - 1) {
        // Handle the last item
        if (consecutiveTiles.length >= 3) {
          somethingWasMarked = true;
          markTiles(consecutiveTiles);
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
      if (tile.state.tileType === TILE_TYPE_MARKED) {
        tile.setState({
          tileType: 'empty',
        });
      }
    }
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      this._grid.rowAt(y).forEach(clearTileIfMarked);
    }
  };
}
