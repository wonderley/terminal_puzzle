#! /usr/bin/env node
import { Grid } from './grid';
import { TerminalGridView } from './terminal_grid_view';
export declare class Cursor {
    private _grid;
    private _view;
    constructor(_grid: Grid, _view: TerminalGridView);
    private _x;
    private _y;
    getX(): number;
    getY(): number;
    isValidCursorPosition(x: number, y: number): boolean;
    setPosition(x: number, y: number): void;
    goUp(): void;
    goDown(): void;
    goLeft(): void;
    goRight(): void;
    swapTiles: () => void;
}
