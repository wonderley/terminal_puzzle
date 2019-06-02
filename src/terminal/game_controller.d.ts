import { Grid } from './grid';
export declare class GameController {
    grid: Grid | null;
    view: any;
    cursor: any;
    inputController: any;
    gravityController: any;
    tileClearController: any;
    gameAdvanceIntervalInMillis: any;
    advanceGameIntervalId: any;
    private static _instance;
    static instance: GameController;
    onGridChanged(): void;
    onGameOver(): void;
    evaluateGrid(): void;
    startGame(): void;
    advanceGame(): void;
}
