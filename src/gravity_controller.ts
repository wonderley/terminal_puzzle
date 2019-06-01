import { Grid } from './grid';
import { TileState } from './tile';
import { TerminalGridView as View } from './terminal_grid_view';

/**
 * Applies gravity to the Grid
 */
export class GravityController {
  constructor(private readonly _grid: Grid, private readonly _view: View) {
  }
  dropTileAt(x: number, y: number) {
    let theTile = this._grid.tileAt(x, y);
    for (let currentY = y; currentY < Grid.ROW_COUNT - 1; ++currentY) {
      let tileBelow = this._grid.tileAt(x, currentY + 1);
      if (tileBelow.state !== TileState.EMPTY) {
        break;
      }
      this._grid.swapTilesAt(x, currentY, x, currentY + 1);
    }
  };
  /**
   * For now, just apply all gravity at once without animation or anything.
   */
  applyGravity() {
    // Start from the second row.
    for (let y = Grid.ROW_COUNT - 2; y >= 0; --y) {
      let row = this._grid.rowAt(y);
      for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        if (this._grid.tileAt(x, y).state !== TileState.EMPTY) {
          this.dropTileAt(x, y);
        }
      }
    }
  };
}
