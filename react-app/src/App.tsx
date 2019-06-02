import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GameController } from './terminal/game_controller';
import { Grid } from './terminal/grid';
import { ReactGridView } from './terminal/react_grid_view';
import { Cursor } from './terminal/cursor';
import { TerminalInputController } from './terminal/terminal_input_controller';
import { GravityController } from './terminal/gravity_controller';
import { TileClearController } from './terminal/tile_clear_controller';
import GridComponent from './components/GridComponent';

export function App() {
  start();
  return (
    <div className="App">
      <GridComponent name="TypeScript" />
    </div>
  );
}

function start() {
  const game = GameController.instance;
  game.grid = new Grid();
  game.view = new ReactGridView(game.grid);
  game.cursor = new Cursor(game.grid, game.view);
  game.inputController = new TerminalInputController(game.cursor);
  game.view.setInputDelegate(game.inputController);
  game.gravityController = new GravityController(game.grid, game.view);
  game.tileClearController = new TileClearController(game.grid);
  game.gameAdvanceIntervalInMillis = 3000;
  game.advanceGameIntervalId = null;
  game.startGame();
}

export default App;
