import * as React from 'react';
import './GridComponent.css';
import { GridView } from '../terminal/grid_view';
import { InputDelegate } from '../terminal/input_delegate';
import { Grid } from '../terminal/grid';
import { TileComponent } from './TileComponent';

export interface GridProps {
  grid: Grid;
  name: string;
}

export interface GridState {
  dimensions: {
    height: number,
    width: number,
  } | null;
}

export class GridComponent
       extends React.Component<GridProps, GridState>
       implements GridView {
  private _container: HTMLDivElement | null = null;

  constructor(props: any, context?: any) {
    super(props, context);
    this.state = { dimensions: null }
  }

  render() {
    const { dimensions } = this.state;
    return (
      <div className="grid" ref={el => (this._container = el)}>
        {dimensions && this.renderContent(dimensions)}
      </div>
    );
  }

  renderContent(dimensions: { height: number, width: number }): JSX.Element[] {
    const tileHeight = dimensions.height / Grid.ROW_COUNT;
    const tileWidth = dimensions.width / Grid.COLUMN_COUNT;
    const tiles: JSX.Element[] = [];
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        const top = tileHeight * y;
        const left = tileWidth * x;
        tiles.push(<TileComponent
                      tile={this.props.grid.tileAt(x,y)}
                      top={top}
                      left={left} />);
      }
    }
    return tiles;
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        width: this._container!.offsetWidth,
        height: this._container!.offsetHeight,
      },
    });
  }

  initializeView(): void {
    // create a tile holder view
    // create the tiles and place them in it
    // add a cursor
    // add bottom row marker
    // this.registerKeys();
    // this.props.grid.advanceRows();
    this.updateView();
  }
  updateView(): void {
    // update the tile locations
    // update tile holder view location

    // const subrowAdjustment = this._currentSubrow - this.props.grid.currentSubrow;
    // this._currentSubrow = this.props.grid.currentSubrow;
    // for (let y = 0; y < Grid.ROW_COUNT; ++y) {
    //   let isBottomRow = (y === Grid.ROW_COUNT - 1);
    //   for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
    //     let tile = this.props.grid.tileAt(x,y);
    //     let tileView = this._rows[y][x];
        // use css classes for this
        // let color = this.colorForTile(tile, isBottomRow);
        // tileView.style.bg = color;
        // tileView.position.top += subrowAdjustment;
    //   }
    // }
    // update cursor
    // this._cursorBox.position.top += subrowAdjustment;
    // render the screen
    // this._screen.render();
  }
  drawCursorAt(x: number, y: number): void {
  }
  clearCursorAt(x: number, y: number): void {
  }
  setInputDelegate(inputDelegate: InputDelegate): void {
  }
}

export default GridComponent;