import React from 'react';
import './App.css';
import { Grid } from './terminal/grid';
import { GridComponent } from './components/GridComponent';

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
  constructor(props: any, context?: any) {
    super(props, context);
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
    return <GridComponent height={gridHeight}
                          width={gridWidth}
                          onComponentDidMount={this.gridComponentDidMount.bind(this)} />;
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
    // todo game.inputController = new InputController(grid.cursor);
    gridComponent.cursor.setPosition(Grid.COLUMN_COUNT / 2, Grid.ROW_COUNT / 2);
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

  get grid(): GridComponent {
    debugger;
    return this.props.children as GridComponent;
  }

  evaluateGrid() {
    if (!this.grid.tileClearController.markTilesToClear()) {
      return;
    }
    // todo grid.updateView();
    let that = this;
    setTimeout(function() {
      that.grid.tileClearController.clearMarkedTiles();
      // todo grid.updateView();
      setTimeout(function() {
        that.onGridChanged();
      }, 100);
    }, 500);
  }

  advanceGame() {
    this.grid.model.advanceRowsSmall();
    if (this.grid.model.currentSubrow === 0) {
      // Assume that the rows have just advanced to the next row.
      // Move the cursor to the next row.
      if (this.grid.cursor.getY() > 0) {
        this.grid.cursor.setPosition(this.grid.cursor.getX(), this.grid.cursor.getY() - 1);
      }
    }
  }
}

export default App;
