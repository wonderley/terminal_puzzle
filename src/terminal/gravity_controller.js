"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = require("./grid");
const tile_1 = require("./tile");
class GravityController {
    constructor(_grid, _view) {
        this._grid = _grid;
        this._view = _view;
    }
    dropTileAt(x, y) {
        let theTile = this._grid.tileAt(x, y);
        for (let currentY = y; currentY < grid_1.Grid.ROW_COUNT - 1; ++currentY) {
            let tileBelow = this._grid.tileAt(x, currentY + 1);
            if (tileBelow.state !== tile_1.TileState.EMPTY) {
                break;
            }
            this._grid.swapTilesAt(x, currentY, x, currentY + 1);
        }
    }
    ;
    applyGravity() {
        for (let y = grid_1.Grid.ROW_COUNT - 2; y >= 0; --y) {
            let row = this._grid.rowAt(y);
            for (let x = 0; x < grid_1.Grid.COLUMN_COUNT; ++x) {
                if (this._grid.tileAt(x, y).state !== tile_1.TileState.EMPTY) {
                    this.dropTileAt(x, y);
                }
            }
        }
    }
    ;
}
exports.GravityController = GravityController;
//# sourceMappingURL=gravity_controller.js.map