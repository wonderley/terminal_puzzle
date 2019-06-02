"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileState;
(function (TileState) {
    TileState[TileState["EMPTY"] = 0] = "EMPTY";
    TileState[TileState["A"] = 1] = "A";
    TileState[TileState["B"] = 2] = "B";
    TileState[TileState["C"] = 3] = "C";
    TileState[TileState["D"] = 4] = "D";
    TileState[TileState["COUNT"] = 5] = "COUNT";
})(TileState = exports.TileState || (exports.TileState = {}));
class Tile {
    constructor(state) {
        this.state = state;
        Tile.__tileCount += 1;
    }
}
Tile.NONEMPTY_STATES = [TileState.A, TileState.B, TileState.C, TileState.D];
Tile.__tileCount = 0;
exports.Tile = Tile;
//# sourceMappingURL=tile.js.map