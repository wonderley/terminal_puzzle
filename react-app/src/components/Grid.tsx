import * as React from 'react';
import './Grid.css';
import { Tile, TileType, TILE_TYPE_EMPTY } from './Tile';
import { Cursor } from '../terminal/cursor';
import { InputController } from '../terminal/input_controller';
import { GravityController } from '../terminal/gravity_controller';
import { TileClearController } from '../terminal/tile_clear_controller';

export interface GridProps {
  height: number,
  width: number,
  onGridReady: (gridComponent: Grid) => void,
}

export class Grid
       extends React.Component<GridProps> {

  public static readonly ROW_COUNT: number = 12;
  public static readonly COLUMN_COUNT: number = 6;
  public static readonly SUBROWS_PER_ROW: number = 4;

  gravityController = new GravityController(this);
  tileClearController = new TileClearController(this);
  cursor: Cursor = new Cursor(this, this);
  inputController = new InputController(this, this.cursor);  currentSubrow: number = 0;
  rows: Tile[][] = [];

  private _tilesMounted = 0;

  constructor(props: GridProps) {
    super(props);
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      // Prepopulate the rows so tiles can be
      // inserted out of order in tileDidMount
      this.rows.push(Array(10));
    }
  }

  render() {
    const tileHeight = this.props.height / Grid.ROW_COUNT;
    const tileWidth = this.props.width / Grid.COLUMN_COUNT;
    const tiles: JSX.Element[] = [];
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        tiles.push(<Tile
                    key={`${x},${y}`} initialX={x} initialY={y}
                    height={tileHeight} width={tileWidth}
                    onComponentDidMount={this.tileDidMount.bind(this)} />);
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

  tileDidMount(tile: Tile) {
    this.rows[tile.state.y][tile.state.x] = tile;
    this._tilesMounted++;
    if (this._tilesMounted === Grid.ROW_COUNT * Grid.COLUMN_COUNT)
      this.props.onGridReady(this);
  }

  drawCursorAt(x: number, y: number) {
    this.tileAt(x, y).setState({ cursor: true });
    this.tileAt(x+1, y).setState({ cursor: true });
  }

  clearCursorAt(x: number, y: number) {
    this.tileAt(x, y).setState({ cursor: false });
    this.tileAt(x+1, y).setState({ cursor: false });
  }

  advanceGame() {
    this.advanceRowsSmall();
    if (this.currentSubrow === 0) {
      // Assume that the rows have just advanced to the next row.
      // Move the cursor to the next row.
      if (this.cursor.getY() > 0) {
        this.cursor.setPosition(this.cursor.getX(), this.cursor.getY() - 1);
      }
      // The new row on the bottom may cause a vertical match.
      this.evaluate();
    }
    // Force update because the rows are currently not
    // part of state. Even if they were, a forced call like
    // this.setState({ rows: this.rows }); would need
    // to go here.
    this.forceUpdate();
  }

  public randomizeFirstRow() {
    const rows = this.rows;
    const row = rows[rows.length - 1];
    const tileTypeCounter = {
      type: TILE_TYPE_EMPTY,
      count: 0
    };

    for (let j = 0; j < Grid.COLUMN_COUNT; ++j) {
      let allowedTypes = Tile.NONEMPTY_TYPES;
      if (tileTypeCounter.count >= 2) {
        // Remove the state from the list of the allowed states
        allowedTypes = allowedTypes
          .filter(s => s !== tileTypeCounter.type);
      }
      const tileType = this.randomOccupiedTileProps(allowedTypes);
      if (tileType === tileTypeCounter.type) {
        tileTypeCounter.count += 1;
      } else {
        tileTypeCounter.type = tileType;
        tileTypeCounter.count = 1;
      }
      row[j].setState({
        cursor: false,
        tileType,
      });
    }
  }

  tileAt(x: number, y: number): Tile {
    if (x >= Grid.COLUMN_COUNT ||
        y >= Grid.ROW_COUNT ||
        x < 0 ||
        y < 0) {
      throw new Error('out of bounds');
    }
    return this.rows[y][x];
  }

  rowAt(y: number) {
    if (y >= Grid.ROW_COUNT || y < 0) {
      throw new Error('out of bounds');
    }
    return this.rows[y];
  }

  columnAt(x: number) {
    let column = [];
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      column.push(this.tileAt(x, y));
    }
    return column;
  }

  swapTilesAt(x1: number, y1: number, x2: number, y2: number) {
    const tile1 = this.tileAt(x1, y1);
    const tile2 = this.tileAt(x2, y2);
    const state1 = tile1.state;
    const state2 = tile2.state;
    tile1.setState({ tileType: state2.tileType });
    tile2.setState({ tileType: state1.tileType });
  }

  advanceRowsSmall() {
    this.currentSubrow = (this.currentSubrow + 1) % Grid.SUBROWS_PER_ROW;
    const subrow = this.currentSubrow;
    this.rows.forEach(row => 
         row.forEach(tile => tile.setState({ subrow })));
    if (subrow === 0) {
      this.advanceRows();
    }
  }

  /**
   * Bring the rows upwards by one and add a new row
   * of occupied tiles to the bottom.
   */
  advanceRows() {
    const rows = this.rows;
    rows.forEach(row => row.forEach(tile =>
      tile.setState({ y: tile.state.y - 1 }
    )));
    const topRow = rows[0];
    const topRowTilesEmpty = topRow.every(tile =>
      tile.state.tileType === TILE_TYPE_EMPTY);
    if (topRowTilesEmpty) {
      // Top row is empty. It can be used as the new bottom row.
      rows.shift();
      rows.push(topRow);
      topRow.forEach(tile =>
        tile.setState({ y: rows.length - 1 }));
      this.randomizeFirstRow();
    } else {
      // todo this._gridComponent.onGameOver();
    }
  }

  randomOccupiedTileProps(allowedTypes: TileType[]): TileType {
    let randomFloat = Math.random() * (allowedTypes.length);
    let tileIndex = Math.floor(randomFloat);
    return allowedTypes[tileIndex];
  }

  evaluate() {
    let that = this;
    if (!this.tileClearController.markTilesToClear()) {
      setTimeout(function() {
        that.gravityController.applyGravity();
      }, 100);
      return;
    }
    setTimeout(function() {
      that.tileClearController.clearMarkedTiles();
      setTimeout(function() {
        that.gravityController.applyGravity();
      }, 100);
    }, 500);
  }
}

export default Grid;