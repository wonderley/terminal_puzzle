import { Grid } from './grid';
import { InputDelegate } from './input_delegate';
export declare class TerminalGridView {
    private readonly _grid;
    static readonly tileWidth: number;
    static readonly tileHeight: number;
    static readonly widthBetweenTiles: number;
    static readonly heightBetweenTiles = 1;
    private _screen;
    private _rows;
    private _cursorBox;
    private _inputDelegate;
    currentSubrow: number;
    constructor(_grid: Grid);
    private colorForTile;
    private registerKeys;
    initializeView(): void;
    updateView(): void;
    drawCursorAt(x: number, y: number): void;
    clearCursorAt(x: number, y: number): void;
    setInputDelegate(inputDelegate: InputDelegate): void;
}
