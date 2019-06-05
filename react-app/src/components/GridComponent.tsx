import * as React from 'react';
import './GridComponent.css';
import { GridView } from '../terminal/grid_view';
import { InputDelegate } from '../terminal/input_delegate';
import { Grid } from '../terminal/grid';
import { TileComponent } from './TileComponent';

export interface GridProps {
  grid: Grid;
  height: number,
  width: number,
  onComponentDidMount: (gridComponent: GridComponent) => void,
}

interface GridDimensions {
  height: number,
  width: number,
}

export interface GridState {
  dimensions: GridDimensions | null;
}

export class GridComponent
       extends React.Component<GridProps, GridState>
       implements GridView {

  render() {
    const tileBorderWidth = 2;
    const tileHeight =
      this.props.height / Grid.ROW_COUNT - tileBorderWidth;
    const tileWidth =
      this.props.width / Grid.COLUMN_COUNT - tileBorderWidth;
    const tiles: JSX.Element[] = [];
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        const top = (tileHeight + tileBorderWidth) * y;
        const left = (tileWidth + tileBorderWidth) * x;
        tiles.push(<TileComponent
                      tile={this.props.grid.tileAt(x,y)}
                      top={top}
                      left={left}
                      height={tileHeight}
                      width={tileWidth} />);
      }
    }
    return (
      <div className="grid"
           style={{
            height: this.props.height,
            width: this.props.width,
           }} >
        {tiles}
      </div>
    );
  }

  componentDidMount() {
    this.props.onComponentDidMount(this);
  }

  initializeView(): void {
  }

  updateView(): void {
  }
  
  drawCursorAt(x: number, y: number): void {
    [x, x+1].forEach(xVal => {
      const tile = this.props.grid.tileAt(xVal, y);
      tile.tileComponent!.setState({ cursor: true });
    });
  }
  clearCursorAt(x: number, y: number): void {
    [x, x+1].forEach(xVal => {
      const tile = this.props.grid.tileAt(xVal, y);
      tile.tileComponent!.setState({ cursor: false });
    });
  }
  setInputDelegate(inputDelegate: InputDelegate): void {
  }
}

export default GridComponent;