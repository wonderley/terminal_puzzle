import { Cursor } from './cursor';
import { GameController } from './game_controller';
import { InputDelegate } from './input_delegate';
  
export class InputController implements InputDelegate {
  constructor(private _cursor: Cursor) {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  onKeyDown(e: KeyboardEvent) {
    debugger;
    this.onUserInput(e.key);
  }
  onUserInput(key: string) {
    // Quit on Escape, q, or Control-C.
    if (key === 'escape' || key === 'q' || key === 'C-c') {
      return process.exit(0);
    }
    if (key === 'ArrowUp' || key === 'k') {
      this._cursor.goUp();
    }
    if (key === 'ArrowDown' || key === 'j') {
      this._cursor.goDown();
    }
    if (key === 'ArrowLeft' || key === 'h') {
      this._cursor.goLeft();
    }
    if (key === 'ArrowRight' || key === 'l') {
      this._cursor.goRight();
    }
    if (key === ' ') {
      this._cursor.swapTiles();
    }
    if (key === 'a') {
      // Quickly advance the game four times.
      let advanceGameWithBoundThis = 
        GameController.instance.advanceGame
        .bind(GameController.instance);
      setTimeout(advanceGameWithBoundThis, 100);
      setTimeout(advanceGameWithBoundThis, 200);
      setTimeout(advanceGameWithBoundThis, 300);
      setTimeout(advanceGameWithBoundThis, 400);
    }
  };
}
