"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_controller_1 = require("./game_controller");
const tile_1 = require("./tile");
class Grid {
    constructor() {
        this._rows = [];
        this.subrowsPerRow = 4;
        this.currentSubrow = 0;
        for (let i = 0; i < Grid.ROW_COUNT; ++i) {
            this.addEmptyRow();
        }
    }
    addEmptyRow() {
        let row = [];
        for (let j = 0; j < Grid.COLUMN_COUNT; ++j) {
            const tile = new tile_1.Tile(tile_1.TileState.EMPTY);
            row.push(tile);
        }
        this._rows.push(row);
    }
    addPopulatedRow() {
        let row = this.generateRandomRow();
        this._rows.push(row);
    }
    removeRow() {
        this._rows.shift();
    }
    isNotLastTileState(state, lastTileState) {
        return state !== lastTileState.state;
    }
    generateRandomRow() {
        let row = [];
        let lastTileState = {
            state: tile_1.TileState.EMPTY,
            count: 0
        };
        for (let j = 0; j < Grid.COLUMN_COUNT; ++j) {
            let tile = new tile_1.Tile(tile_1.TileState.EMPTY);
            let allowedStates = tile_1.Tile.NONEMPTY_STATES;
            if (lastTileState.count >= 2) {
                allowedStates = allowedStates
                    .filter(s => s !== lastTileState.state);
            }
            tile.state = this.randomOccupiedTileState(allowedStates);
            if (tile.state === lastTileState.state) {
                lastTileState.count += 1;
            }
            else {
                lastTileState.state = tile.state;
                lastTileState.count = 1;
            }
            row.push(tile);
        }
        return row;
    }
    tileAt(x, y) {
        if (x >= Grid.COLUMN_COUNT ||
            y >= Grid.ROW_COUNT ||
            x < 0 ||
            y < 0) {
            throw 'out of bounds';
        }
        return this._rows[y][x];
    }
    rowAt(y) {
        if (y >= Grid.ROW_COUNT || y < 0) {
            throw new Error('out of bounds');
        }
        return this._rows[y];
    }
    columnAt(x) {
        let column = [];
        for (let y = 0; y < Grid.ROW_COUNT; ++y) {
            column.push(this.tileAt(x, y));
        }
        return column;
    }
    swapTilesAt(x1, y1, x2, y2) {
        let tile1 = this._rows[y1][x1];
        this._rows[y1][x1] = this._rows[y2][x2];
        this._rows[y2][x2] = tile1;
    }
    advanceRowsSmall() {
        this.currentSubrow = (this.currentSubrow + 1) % this.subrowsPerRow;
        if (this.currentSubrow > 0) {
            game_controller_1.GameController.instance.onGridChanged();
            return;
        }
        else {
            this.advanceRows();
        }
    }
    advanceRows() {
        this.addPopulatedRow();
        let topRow = this._rows[0];
        for (let i = 0; i < topRow.length; ++i) {
            let topTile = topRow[i];
            if (topTile.state !== tile_1.TileState.EMPTY) {
                game_controller_1.GameController.instance.onGameOver();
                return;
            }
        }
        this.removeRow();
        game_controller_1.GameController.instance.onGridChanged();
    }
    randomOccupiedTileState(allowedStates) {
        let randomFloat = Math.random() * (allowedStates.length);
        let tileIndex = Math.floor(randomFloat);
        return allowedStates[tileIndex];
    }
}
Grid.ROW_COUNT = 12;
Grid.COLUMN_COUNT = 6;
exports.Grid = Grid;
//# sourceMappingURL=grid.js.map