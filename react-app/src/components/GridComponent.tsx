import * as React from 'react';
import './GridComponent.css';
import { Grid } from '../terminal/grid';
import { TileComponent } from './TileComponent';
import { Cursor } from '../terminal/cursor';
import { InputController } from '../terminal/input_controller';
import { GravityController } from '../terminal/gravity_controller';
import { TileClearController } from '../terminal/tile_clear_controller';

export interface GridProps {
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
       extends React.Component<GridProps, GridState> {
  model: Grid = new Grid(this); // todo: make Grid a container?
  gravityController = new GravityController(this.model);
  tileClearController = new TileClearController(this.model);
  cursor: Cursor = new Cursor(this.model, this);
  inputController = new InputController(this.cursor);
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
                      tile={this.model.tileAt(x,y)}
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

  drawCursorAt(x: number, y: number): void {
    [x, x+1].forEach(xVal => {
      const tile = this.model.tileAt(xVal, y);
      tile.tileComponent!.setState({ cursor: true });
    });
  }

  clearCursorAt(x: number, y: number): void {
    [x, x+1].forEach(xVal => {
      const tile = this.model.tileAt(xVal, y);
      tile.tileComponent!.setState({ cursor: false });
    });
  }
}

export default GridComponent;