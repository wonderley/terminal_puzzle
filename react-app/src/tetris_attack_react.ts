let GameController = require('./terminal/game_controller.js').GameController;
if (require.main === module) {
  let Grid = require('./terminal/grid.js').Grid;
  let TerminalGridView = require('./terminal/react_grid_view.js').TerminalGridView;
  let Cursor = require('./terminal/cursor.js').Cursor;
  let TerminalInputController = require('./terminal/terminal_input_controller.js').TerminalInputController;
  let GravityController = require('./terminal/gravity_controller.js').GravityController;
  let TileClearController = require('./terminal/tile_clear_controller.js').TileClearController;
  const game = GameController.instance;
  game.grid = new Grid();
  game.view = new TerminalGridView(game.grid);
  game.cursor = new Cursor(game.grid, game.view);
  game.inputController = new TerminalInputController(game.cursor);
  game.view.setInputDelegate(game.inputController);
  game.gravityController = new GravityController(game.grid, game.view);
  game.tileClearController = new TileClearController(game.grid);
  game.gameAdvanceIntervalInMillis = 3000;
  game.advanceGameIntervalId = null;
  game.startGame();
}
