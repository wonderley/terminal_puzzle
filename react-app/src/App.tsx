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

const App: React.FC = () => {
  start();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
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
