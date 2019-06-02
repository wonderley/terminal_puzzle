"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = require("./grid");
const tile_1 = require("./tile");
class TerminalGridView {
    constructor(_grid) {
        this._grid = _grid;
        this._screen = null;
        this._rows = [];
        this._cursorBox = null;
        this._inputDelegate = null;
        this.currentSubrow = 0;
    }
    colorForTile(tile, isBottomRow) {
        if (tile.markedToClear) {
            return 'black';
        }
        let light = isBottomRow ? '' : 'light ';
        let tileState = tile.state;
        if (tileState === tile_1.TileState.EMPTY) {
            return 'default';
        }
        else if (tileState === tile_1.TileState.A) {
            return light + 'green';
        }
        else if (tileState === tile_1.TileState.B) {
            return light + 'blue';
        }
        else if (tileState === tile_1.TileState.C) {
            return light + 'magenta';
        }
        else if (tileState === tile_1.TileState.D) {
            return light + 'red';
        }
        throw 'Invalid TileState.';
    }
    registerKeys() {
        const that = this;
        this._screen.on('keypress', function (_, key) {
            if (key) {
                that._inputDelegate.onUserInput(key);
            }
        });
    }
    initializeView() {
    }
    ;
    updateView() {
    }
    ;
    drawCursorAt(x, y) {
    }
    ;
    clearCursorAt(x, y) {
    }
    ;
    setInputDelegate(inputDelegate) {
    }
    ;
}
TerminalGridView.tileWidth = 4;
TerminalGridView.tileHeight = 3;
TerminalGridView.widthBetweenTiles = 2;
TerminalGridView.heightBetweenTiles = 1;
exports.TerminalGridView = TerminalGridView;
if (require.main === module) {
    let grid = new grid_1.Grid();
    let view = new TerminalGridView(grid);
    view.initializeView();
    setInterval(function () {
        grid.advanceRows();
        view.updateView();
    }, 2000);
}
//# sourceMappingURL=react_grid_view.js.map