#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = require("./grid");
const tile_1 = require("./tile");
class TileClearController {
    constructor(_grid) {
        this._grid = _grid;
    }
    markTilesToClear() {
        let somethingWasMarked = false;
        let markEachTile = function (_, idx, arr) {
            arr[idx].markedToClear = true;
        };
        let currentState = tile_1.TileState.EMPTY;
        let consecutiveTiles = [];
        function markConsecutiveTilesInArray(tile, idx, arr) {
            if (tile.state !== tile_1.TileState.EMPTY &&
                tile.state === currentState) {
                consecutiveTiles.push(tile);
            }
            else {
                if (consecutiveTiles.length >= 3) {
                    somethingWasMarked = true;
                    consecutiveTiles.forEach(markEachTile);
                }
                consecutiveTiles = [tile];
            }
            if (idx === arr.length - 1) {
                if (consecutiveTiles.length >= 3) {
                    somethingWasMarked = true;
                    consecutiveTiles.forEach(markEachTile);
                }
                consecutiveTiles = [];
                currentState = tile_1.TileState.EMPTY;
            }
            else {
                currentState = tile.state;
            }
        }
        for (let y = 0; y < grid_1.Grid.ROW_COUNT - 1; ++y) {
            this._grid.rowAt(y).forEach(markConsecutiveTilesInArray);
        }
        for (let x = 0; x < grid_1.Grid.COLUMN_COUNT; ++x) {
            this._grid.columnAt(x).slice(0, grid_1.Grid.ROW_COUNT - 1).forEach(markConsecutiveTilesInArray);
        }
        return somethingWasMarked;
    }
    ;
    clearMarkedTiles() {
        function clearTileIfMarked(tile) {
            if (tile.markedToClear) {
                tile.state = tile_1.TileState.EMPTY;
                tile.markedToClear = false;
            }
        }
        for (let y = 0; y < grid_1.Grid.ROW_COUNT; ++y) {
            this._grid.rowAt(y).forEach(clearTileIfMarked);
        }
    }
    ;
}
exports.TileClearController = TileClearController;
//# sourceMappingURL=tile_clear_controller.js.map