import { Grid } from './grid';
import { TerminalGridView as View } from './terminal_grid_view';
export declare class GravityController {
    private readonly _grid;
    private readonly _view;
    constructor(_grid: Grid, _view: View);
    dropTileAt(x: number, y: number): void;
    applyGravity(): void;
}
