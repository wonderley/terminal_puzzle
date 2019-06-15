import { Grid } from '../components/Grid';
import { Cursor } from './cursor';
  
export class InputController {
  constructor(private _grid: Grid, private _cursor: Cursor) {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  onKeyDown(e: KeyboardEvent) {
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
      // For now, use this as a convenient way of calling advanceGame.
      this._grid.advanceGame();
      // This is the real beahvior:
      // Quickly advance the game four times.
      // todo
      // let advanceGameWithBoundThis = 
      //   GameController.instance.advanceGame
      //   .bind(GameController.instance);
      // setTimeout(advanceGameWithBoundThis, 100);
      // setTimeout(advanceGameWithBoundThis, 200);
      // setTimeout(advanceGameWithBoundThis, 300);
      // setTimeout(advanceGameWithBoundThis, 400);
    }
  }
}
