#! /usr/bin/env node
import { Cursor } from './cursor';
import { GameController } from './game_controller';
import { InputDelegate } from './input_delegate';
  
class TerminalInputController implements InputDelegate {
  constructor(private _cursor: Cursor) {
  }
  onUserInput(input: { full: string }) {
    if (!input || !input.full) {
      return;
    }
    let key = input.full;
    // Quit on Escape, q, or Control-C.
    if (key === 'escape' || key === 'q' || key === 'C-c') {
      return process.exit(0);
    }
    if (key === 'up' || key === 'k') {
      this._cursor.goUp();
    }
    if (key === 'down' || key === 'j') {
      this._cursor.goDown();
    }
    if (key === 'left' || key === 'h') {
      this._cursor.goLeft();
    }
    if (key === 'right' || key === 'l') {
      this._cursor.goRight();
    }
    if (key === 'space') {
      this._cursor.swapTiles();
    }
    if (key === 'a') {
      // Quickly advance the game four times.
	    let advanceGameWithBoundThis = GameController.instance.advanceGame.bind(GameController);
      setTimeout(advanceGameWithBoundThis, 100);
      setTimeout(advanceGameWithBoundThis, 200);
      setTimeout(advanceGameWithBoundThis, 300);
      setTimeout(advanceGameWithBoundThis, 400);
    }
  };
}
  
module.exports = {
  TerminalInputController: TerminalInputController
};
