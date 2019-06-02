export declare enum TileState {
    EMPTY = 0,
    A = 1,
    B = 2,
    C = 3,
    D = 4,
    COUNT = 5
}
export declare class Tile {
    state: TileState;
    static readonly NONEMPTY_STATES: TileState[];
    static __tileCount: number;
    constructor(state: TileState);
    id: number;
    markedToClear: boolean;
}
