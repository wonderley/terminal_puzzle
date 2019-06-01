export enum TileState {
  EMPTY,
  A,
  B,
  C,
  D,
  COUNT,
}

export class Tile {
  public static readonly NONEMPTY_STATES: TileState[]
    = [TileState.A, TileState.B, TileState.C, TileState.D];
  public static __tileCount = 0;
  // stateNum is an easy way to provide a TileState.
  // Can be any integer.
  constructor(public state: TileState) {
    Tile.__tileCount += 1;
  }
  id: number;
  markedToClear: boolean;
}
