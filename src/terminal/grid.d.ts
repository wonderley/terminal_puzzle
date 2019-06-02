import { Tile, TileState } from './tile';
export declare class Grid {
    private _rows;
    static readonly ROW_COUNT: number;
    static readonly COLUMN_COUNT: number;
    constructor();
    private addEmptyRow;
    private addPopulatedRow;
    private removeRow;
    private isNotLastTileState;
    subrowsPerRow: number;
    currentSubrow: number;
    generateRandomRow(): Tile[];
    tileAt(x: number, y: number): any;
    rowAt(y: number): any;
    columnAt(x: number): any[];
    swapTilesAt(x1: number, y1: number, x2: number, y2: number): void;
    advanceRowsSmall(): void;
    advanceRows(): void;
    randomOccupiedTileState(allowedStates: TileState[]): TileState;
}
