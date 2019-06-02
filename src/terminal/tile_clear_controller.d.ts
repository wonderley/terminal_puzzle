#! /usr/bin/env node
import { Grid } from './grid';
export declare class TileClearController {
    private _grid;
    constructor(_grid: Grid);
    markTilesToClear(): boolean;
    clearMarkedTiles(): void;
}
