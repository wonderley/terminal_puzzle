#! /usr/bin/env node

(function(){

"use strict";

module.exports = {
  // public - GridDelegate methods
  onGridChanged: function(){
    this.view.updateView();
    var that = this;
    setTimeout(function(){
      that.gravityController.applyGravity();
      that.view.updateView();
      that.evaluateGrid();
    }, 200);
  },
  onGameOver: function(){
    clearInterval(this.advanceGameIntervalId);
    this.advanceGameIntervalId = setInterval(this.advanceGame.bind(this), this.gameAdvanceIntervalInMillis);
  },
  evaluateGrid: function(){
    if (!this.tileClearController.markTilesToClear()){
      return;
    }
    this.view.updateView();
    var that = this;
    setTimeout(function(){
      that.tileClearController.clearMarkedTiles();
      that.view.updateView();
      setTimeout(function(){
        that.onGridChanged();
      }, 100);
    }, 500);
  },
  startGame: function(){
    this.view.initializeView();
    this.cursor.setPosition(this.grid.columnCount / 2, this.grid.rowCount / 2);
    this.advanceGameIntervalId = setInterval(this.advanceGame.bind(this), this.gameAdvanceIntervalInMillis);
  },
  advanceGame: function(){
    this.grid.advanceRowsSmall();
    if (this.grid.currentSubrow === 0) {
      // Assume that the rows have just advanced to the next row.
      // Move the cursor to the next row.
      if (this.cursor.getY() > 0){
        this.cursor.setPosition(this.cursor.getX(), this.cursor.getY() - 1);
      }
    }
  },
  grid: null,
  view: null,
  cursor: null,
  inputController: null,
  gravityController: null,
  tileClearController: null,
  gameAdvanceIntervalInMillis: 3000,
  advanceGameIntervalId: null,
};
})();
