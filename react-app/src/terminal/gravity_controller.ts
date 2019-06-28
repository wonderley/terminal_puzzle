import { TILE_TYPE_EMPTY } from '../components/Tile';
import { Grid } from '../components/Grid';

/**
 * Applies gravity to the Grid
 */
export class GravityController {
  constructor(private readonly _grid: Grid) {
  }

  dropTileAt(x: number, y: number) {
    for (let currentY = y; currentY < Grid.ROW_COUNT - 1; ++currentY) {
      let tileBelow = this._grid.tileAt(x, currentY + 1);
      if (tileBelow.state.tileType !== TILE_TYPE_EMPTY) {
        break;
      }
      this._grid.swapTilesAt(x, currentY, x, currentY + 1);
    }
  }

  /**
   * For now, just apply all gravity at once without animation or anything.
   */
  applyGravity() {
    // Start from the second row.
    for (let y = Grid.ROW_COUNT - 2; y >= 0; --y) {
      for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        if (this._grid.tileAt(x, y).state.tileType !== TILE_TYPE_EMPTY) {
          this.dropTileAt(x, y);
        }
      }
    }
    this._grid.evaluate();
  }
}
