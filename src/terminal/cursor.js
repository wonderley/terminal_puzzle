#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = require("./grid");
const game_controller_1 = require("./game_controller");
class Cursor {
    constructor(_grid, _view) {
        this._grid = _grid;
        this._view = _view;
        this._x = -1;
        this._y = -1;
        this.swapTiles = function () {
            this._grid.swapTilesAt(this._x, this._y, this._x + 1, this._y);
            game_controller_1.GameController.instance.onGridChanged();
        };
    }
    getX() {
        return this._x;
    }
    getY() {
        return this._y;
    }
    isValidCursorPosition(x, y) {
        return x >= 0 &&
            x < grid_1.Grid.COLUMN_COUNT - 1 &&
            y >= 0 &&
            y < grid_1.Grid.ROW_COUNT - 1;
    }
    setPosition(x, y) {
        if (!this.isValidCursorPosition(x, y)) {
            throw 'Invalid position';
        }
        if (this._x === x && this._y === y) {
            return;
        }
        if (this._x !== -1 && this._y !== -1) {
            this._view.clearCursorAt(this._x, this._y);
        }
        this._x = x;
        this._y = Math.max(y, 0);
        this._view.drawCursorAt(this._x, this._y);
    }
    goUp() {
        let newX = this._x;
        let newY = this._y - 1;
        if (this.isValidCursorPosition(newX, newY)) {
            this.setPosition(newX, newY);
        }
    }
    goDown() {
        let newX = this._x;
        let newY = this._y + 1;
        if (this.isValidCursorPosition(newX, newY)) {
            this.setPosition(newX, newY);
        }
    }
    goLeft() {
        let newX = this._x - 1;
        let newY = this._y;
        if (this.isValidCursorPosition(newX, newY)) {
            this.setPosition(newX, newY);
        }
    }
    goRight() {
        let newX = this._x + 1;
        let newY = this._y;
        if (this.isValidCursorPosition(newX, newY)) {
            this.setPosition(newX, newY);
        }
    }
}
exports.Cursor = Cursor;
//# sourceMappingURL=cursor.js.map