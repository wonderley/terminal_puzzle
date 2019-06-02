"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = require("./grid");
class GameController {
    constructor() {
        this.grid = null;
        this.view = null;
        this.cursor = null;
        this.inputController = null;
        this.gravityController = null;
        this.tileClearController = null;
        this.gameAdvanceIntervalInMillis = 3000;
        this.advanceGameIntervalId = null;
    }
    static get instance() {
        if (!this._instance) {
            this.instance = new GameController();
        }
        return this._instance;
    }
    static set instance(instance) {
        this._instance = instance;
    }
    onGridChanged() {
        this.view.updateView();
        let that = this;
        setTimeout(function () {
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
        setTimeout(function () {
            that.tileClearController.clearMarkedTiles();
            that.view.updateView();
            setTimeout(function () {
                that.onGridChanged();
            }, 100);
        }, 500);
    }
    startGame() {
        this.view.initializeView();
        this.cursor.setPosition(grid_1.Grid.COLUMN_COUNT / 2, grid_1.Grid.ROW_COUNT / 2);
        this.advanceGameIntervalId = setInterval(this.advanceGame.bind(this), this.gameAdvanceIntervalInMillis);
    }
    advanceGame() {
        this.grid.advanceRowsSmall();
        if (this.grid.currentSubrow === 0) {
            if (this.cursor.getY() > 0) {
                this.cursor.setPosition(this.cursor.getX(), this.cursor.getY() - 1);
            }
        }
    }
}
exports.GameController = GameController;
//# sourceMappingURL=game_controller.js.map
