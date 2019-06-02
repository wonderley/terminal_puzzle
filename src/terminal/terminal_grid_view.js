"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = require("./grid");
const tile_1 = require("./tile");
let blessed = require('blessed');
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
        this._screen = blessed.screen();
        let rowCount = grid_1.Grid.ROW_COUNT;
        let colCount = grid_1.Grid.COLUMN_COUNT;
        let inner = blessed.box({
            top: 'top',
            left: 'left',
            width: colCount * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles) + 4,
            height: (rowCount + 1) * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles),
            fg: 'default',
            bg: 'default',
            tags: true
        });
        let scoreText = blessed.text({
            top: '20%',
            left: '50%',
            width: '30%',
            height: 2,
            fg: 'blue',
            bg: 'default',
            content: 'Score: 0'
        });
        this._screen.append(inner);
        this._screen.append(scoreText);
        for (let i = 0; i < rowCount; ++i) {
            let y = TerminalGridView.heightBetweenTiles + i * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles);
            let tiles = [];
            for (let j = 0; j < colCount; ++j) {
                let x = TerminalGridView.widthBetweenTiles + j * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles);
                let tile = blessed.box({
                    top: y,
                    left: x,
                    width: TerminalGridView.tileWidth,
                    height: TerminalGridView.tileHeight,
                    fg: 'white',
                    bg: 'green'
                });
                tiles.push(tile);
                inner.append(tile);
            }
            this._rows.push(tiles);
        }
        let bottomRowMarkerLeft = blessed.box({
            top: (rowCount - 1) * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles),
            left: 0,
            width: 1,
            height: 1,
            fg: 'white',
            bg: 'white'
        });
        let bottomRowMarkerRight = blessed.box({
            top: (rowCount - 1) * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles),
            left: 1 + colCount * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles),
            width: 1,
            height: 1,
            fg: 'white',
            bg: 'white'
        });
        inner.append(bottomRowMarkerLeft);
        inner.append(bottomRowMarkerRight);
        this._screen.render();
        let yloc = 4 * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles);
        let tiles = [];
        let xloc = 4 * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles);
        this._cursorBox = blessed.box({
            top: yloc,
            left: xloc,
            width: TerminalGridView.tileWidth * 2 + TerminalGridView.widthBetweenTiles * 3,
            height: TerminalGridView.tileHeight + 2 * TerminalGridView.heightBetweenTiles,
            fg: 'white',
            bg: 'white'
        });
        inner.append(this._cursorBox);
        this._cursorBox.setBack();
        let bottomRowBlocker = blessed.box({
            top: (grid_1.Grid.ROW_COUNT - 1) * TerminalGridView.tileHeight + grid_1.Grid.ROW_COUNT * TerminalGridView.heightBetweenTiles,
            left: 0,
            width: grid_1.Grid.COLUMN_COUNT * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles),
            height: TerminalGridView.tileHeight,
            fg: 'default',
            bg: 'default'
        });
        inner.append(bottomRowBlocker);
        this.registerKeys();
        this._grid.advanceRows();
        this.updateView();
    }
    ;
    updateView() {
        let subrowAdjustment = this.currentSubrow - this._grid.currentSubrow;
        this.currentSubrow = this._grid.currentSubrow;
        for (let y = 0; y < grid_1.Grid.ROW_COUNT; ++y) {
            let isBottomRow = (y === grid_1.Grid.ROW_COUNT - 1);
            for (let x = 0; x < grid_1.Grid.COLUMN_COUNT; ++x) {
                let tile = this._grid.tileAt(x, y);
                let tileView = this._rows[y][x];
                let color = this.colorForTile(tile, isBottomRow);
                tileView.style.bg = color;
                tileView.position.top += subrowAdjustment;
            }
        }
        this._cursorBox.position.top += subrowAdjustment;
        this._screen.render();
    }
    ;
    drawCursorAt(x, y) {
        let xloc = x * (TerminalGridView.tileWidth + TerminalGridView.widthBetweenTiles);
        let yloc = y * (TerminalGridView.tileHeight + TerminalGridView.heightBetweenTiles) - this.currentSubrow;
        this._cursorBox.position.top = yloc;
        this._cursorBox.position.left = xloc;
        this._screen.render();
    }
    ;
    clearCursorAt(x, y) {
        let tileView = this._rows[y][x];
        let tileView2 = this._rows[y][x + 1];
    }
    ;
    setInputDelegate(inputDelegate) {
        this._inputDelegate = inputDelegate;
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
//# sourceMappingURL=terminal_grid_view.js.map
