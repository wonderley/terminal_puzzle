#! /usr/bin/env node
import { Grid } from './grid';
import { GameController } from './game_controller';
import { TerminalGridView } from './terminal_grid_view';

export class Cursor {
  constructor(private _grid: Grid, private _view: TerminalGridView) {
  }
  private _x: number = -1;
  private _y: number = -1;
  getX() {
    return this._x;
  }
  getY() {
    return this._y;
  }
  isValidCursorPosition(x: number, y: number) {
    return x >= 0 &&
      x < Grid.columnCount - 1 &&
      y >= 0 &&
      y < Grid.rowCount - 1;
  }
  setPosition(x: number, y: number) {
    if (!this.isValidCursorPosition(x, y)) {
      throw 'Invalid position';  
    }
    if (this._x === x && this._y === y) {
      return;
    }
    if (this._x !== -1 && this._y !== -1) {
      // if not first time this is called
      this._view.clearCursorAt(this._x, this._y);
    }
    this._x = x;
    this._y = Math.max(y, 0);
    this._view.drawCursorAt(this._x, this._y);
  }
  goUp() {
    var newX = this._x;
    var newY = this._y - 1;
    if (this.isValidCursorPosition(newX, newY)) {
      this.setPosition(newX, newY);
    }
  }
  goDown() {
    var newX = this._x;
    var newY = this._y + 1;
    if (this.isValidCursorPosition(newX, newY)) {
      this.setPosition(newX, newY);
    }
  }
  goLeft() {
    var newX = this._x - 1;
    var newY = this._y;
    if (this.isValidCursorPosition(newX, newY)) {
      this.setPosition(newX, newY);
    }
  }
  goRight() {
    var newX = this._x + 1;
    var newY = this._y;
    if (this.isValidCursorPosition(newX, newY)) {
      this.setPosition(newX, newY);
    }
  }
  swapTiles = function() {
    this._grid.swapTilesAt(this._x, this._y, this._x + 1, this._y);
    GameController.instance.onGridChanged();
  };
}
