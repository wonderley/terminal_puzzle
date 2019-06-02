import { Grid } from './grid';

export class GameController {
  grid: Grid = null;
  view: any = null;
  cursor: any = null;
  inputController: any = null;
  gravityController: any = null;
  tileClearController: any = null;
  gameAdvanceIntervalInMillis: any = 3000;
  advanceGameIntervalId: any = null;
  private static _instance: GameController;
  static get instance(): GameController {
    if (!this._instance) {
      this.instance = new GameController();
    }
    return this._instance;
  }
  static set instance(instance: GameController) {
    this._instance = instance;
  }
  onGridChanged() {
    this.view.updateView();
    let that: GameController = this;
    setTimeout(function() {
      that.gravityController.applyGravity();
      that.view.updateView();
      that.evaluateGrid();
    }, 200);
  }

  onGameOver() {
    clearInterval(this.advanceGameIntervalId);
    this.advanceGameIntervalId = setInterval(this.advanceGame.bind(this), this.gameAdvanceIntervalInMillis);
  }

  evaluateGrid() {
    if (!this.tileClearController.markTilesToClear()) {
      return;
    }
    this.view.updateView();
    let that = this;
    setTimeout(function() {
      that.tileClearController.clearMarkedTiles();
      that.view.updateView();
      setTimeout(function() {
        that.onGridChanged();
      }, 100);
    }, 500);
  }

  startGame() {
    this.view.initializeView();
    this.cursor.setPosition(Grid.COLUMN_COUNT / 2, Grid.ROW_COUNT / 2);
    this.advanceGameIntervalId = setInterval(this.advanceGame.bind(this), this.gameAdvanceIntervalInMillis);
  }

  advanceGame() {
    this.grid.advanceRowsSmall();
    if (this.grid.currentSubrow === 0) {
      // Assume that the rows have just advanced to the next row.
      // Move the cursor to the next row.
      if (this.cursor.getY() > 0) {
        this.cursor.setPosition(this.cursor.getX(), this.cursor.getY() - 1);
      }
    }
  }
}
