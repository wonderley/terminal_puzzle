import React from 'react';
import './App.css';
import { Grid } from './components/Grid';

interface AppState {
  dimensions: AppDimensions | null;
}

interface AppDimensions {
  height: number,
  width: number,
}

export class App extends React.Component<any, AppState> {

  static GAME_ADVANCE_INTERVAL_MILLIS = 3000;
  // todo advanceGameIntervalId: NodeJS.Timeout | undefined;
  private _container: HTMLDivElement | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      dimensions: null,
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
    // Give dimensions to grid component that can be divided evenly
    // so that there's no pixel fraction issues.
    const gridBorderWidth = 10;
    const maxGridContentHeight =
      dimensions.height - 2 * gridBorderWidth;
    const tileHeight =
      Math.floor(maxGridContentHeight / Grid.ROW_COUNT);
    const gridHeight = Grid.ROW_COUNT * tileHeight;
    // Tiles are squares
    const tileWidth = tileHeight;
    const gridWidth = Grid.COLUMN_COUNT * tileWidth;
    return <Grid height={gridHeight}
                 width={gridWidth}
                 onGridReady={this.gridReady.bind(this)} />;
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

  gridReady(grid: Grid) {
    grid.cursor.setPosition(Grid.COLUMN_COUNT / 2, Grid.ROW_COUNT / 2);
    grid.randomizeFirstRow();
    // todo this.advanceGameIntervalId = setInterval(this.advanceGame.bind(this), this.gameAdvanceIntervalInMillis);
  }

  // From GameController
  onGridChanged() {
    // todo this.view.updateView();
    // let that: App = this;
    // setTimeout(function() {
    //   that.props.children[0].gravityController.applyGravity();
    //   // todo that.view.updateView();
    //   that.evaluateGrid();
    // }, 200);
  }

  onGameOver() {
    // todo clearInterval(this.advanceGameIntervalId);
    // this.advanceGameIntervalId = setInterval(this.advanceGame.bind(this), App.GAME_ADVANCE_INTERVAL_MILLIS);
  }

  get grid(): Grid {
    return this.props.children as Grid;
  }
}

export default App;
