import { TileComponent } from '../components/TileComponent';

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
  tileComponent: TileComponent | null = null;
  markedToClear: boolean = false;
  constructor(public state: TileState) {
    Tile.__tileCount += 1;
  }
}
