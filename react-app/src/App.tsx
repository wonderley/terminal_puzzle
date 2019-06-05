import React from 'react';
import './App.css';
import { GameController } from './terminal/game_controller';
import { Grid } from './terminal/grid';
import { Cursor } from './terminal/cursor';
import { InputController } from './terminal/input_controller';
import { GravityController } from './terminal/gravity_controller';
import { TileClearController } from './terminal/tile_clear_controller';
import GridComponent from './components/GridComponent';

interface AppState {
  dimensions: AppDimensions | null;
  grid: Grid;
}

interface AppDimensions {
  height: number,
  width: number,
}

export class App extends React.Component<any, AppState> {
  private _container: HTMLDivElement | null = null;
  constructor(props: any, context?: any) {
    super(props, context);
    const game = GameController.instance;
    game.grid = new Grid();
    this.state = {
      dimensions: null,
      grid: game.grid,
    };
  }
  render() {
    const { dimensions } = this.state;
    return (
      <div className="App"
        ref={el => (this._container = el)}>
        {dimensions && this.renderContent(dimensions)}
      </div>
    );
  }
  renderContent(dimensions: AppDimensions): JSX.Element {
    // give dimensions to grid component that can be divided evenly
    // so that there's no pixel fraction issues.
    // todo: can border-width be pulled in here from CSS?
    const gridBorderWidth = 10;
    const maxGridContentHeight =
      this.state.dimensions!.height - 2 * gridBorderWidth;
    const tileHeight =
      Math.floor(maxGridContentHeight / Grid.ROW_COUNT);
    const gridHeight = Grid.ROW_COUNT * tileHeight;
    // Tiles are squares
    const gridWidth = Grid.COLUMN_COUNT * tileHeight;
    return <GridComponent grid={this.state.grid}
                          height={gridHeight}
                          width={gridWidth}
                          onComponentDidMount={this.gridComponentDidMount} />;
  }
  componentDidMount() {
    // Measure container
    const style: CSSStyleDeclaration = window.getComputedStyle(this._container!);
    function stylePropAsNum(propVal: string | null): number {
      const regex = /^[0-9.]*px$/;
      if (!regex.test(propVal!))
        throw new Error('Failed to measure container');
      return Number(propVal!.slice(0, propVal!.length - 2))
    }
    const height = stylePropAsNum(style.height);
    const width = stylePropAsNum(style.width);
    this.setState({
      dimensions: { height, width },
    });
  }
  gridComponentDidMount(gridComponent: GridComponent) {
    const game = GameController.instance;
    const grid: Grid = game.grid!
    game.view = gridComponent;
    game.cursor = new Cursor(grid, game.view);
    game.inputController = new InputController(game.cursor);
    game.gravityController = new GravityController(grid, game.view);
    game.tileClearController = new TileClearController(grid);
    game.gameAdvanceIntervalInMillis = 3000;
    game.advanceGameIntervalId = null;
    game.startGame();
  }
}

export default App;
