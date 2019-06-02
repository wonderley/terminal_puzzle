"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_controller_1 = require("./game_controller");
class TerminalInputController {
    constructor(_cursor) {
        this._cursor = _cursor;
    }
    onUserInput(input) {
        if (!input || !input.full) {
            return;
        }
        let key = input.full;
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
            let advanceGameWithBoundThis = game_controller_1.GameController.instance.advanceGame.bind(game_controller_1.GameController);
            setTimeout(advanceGameWithBoundThis, 100);
            setTimeout(advanceGameWithBoundThis, 200);
            setTimeout(advanceGameWithBoundThis, 300);
            setTimeout(advanceGameWithBoundThis, 400);
        }
    }
    ;
}
module.exports = {
    TerminalInputController: TerminalInputController
};
//# sourceMappingURL=terminal_input_controller.js.map
