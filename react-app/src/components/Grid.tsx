import * as React from 'react';
import './Grid.css';
import { Tile, TileProps, TileType, TILE_TYPE_EMPTY } from './Tile';
import { Cursor } from '../terminal/cursor';
import { InputController } from '../terminal/input_controller';
import { GravityController } from '../terminal/gravity_controller';
import { TileClearController } from '../terminal/tile_clear_controller';

export interface GridProps {
  height: number,
  width: number,
  onGridReady: (gridComponent: Grid) => void,
}

interface GridState {
  rows: TileProps[][];
}

export class Grid
       extends React.Component<GridProps, GridState> {

  public static readonly ROW_COUNT: number = 12;
  public static readonly COLUMN_COUNT: number = 6;
  public static readonly SUBROWS_PER_ROW: number = 4;

  gravityController = new GravityController(this);
  tileClearController = new TileClearController(this);
  cursor: Cursor = new Cursor(this, this);
  inputController = new InputController(this, this.cursor);  currentSubrow: number = 0;

  constructor(props: GridProps) {
    super(props);
    this.state = {
      rows: [],
    };
    debugger;
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      const row: TileProps[] = [];
      for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        row.push({
          x,
          y,
          subrow: 0,
          cursor: false,
          tileType: 'empty',
          height: 0,
          width: 0,
        });
      }
      this.state.rows.push(row);
    }
  }

  render() {
    const tileHeight = this.props.height / Grid.ROW_COUNT;
    const tileWidth = this.props.width / Grid.COLUMN_COUNT;
    const tiles: JSX.Element[] = [];
    this.state.rows.forEach((row, y) => row.forEach((tileProps, x) => {
      tiles.push(<Tile
        key={`${x},${y}`} x={tileProps.x} y={tileProps.y}
        height={tileHeight} width={tileWidth} subrow={tileProps.subrow}
        cursor={tileProps.cursor} tileType={tileProps.tileType} />);
    }));
    return (
      <div className="grid" style={{
          height: this.props.height,
          width: this.props.width,
      }} >
        {tiles}
      </div>
    );
  }

  componentDidMount() {
    this.props.onGridReady(this);
  }

  drawCursorAt(x: number, y: number) {
    this.updateTile(this.tileAt(x, y), { cursor: true });
    this.updateTile(this.tileAt(x+1, y), { cursor: true });
  }

  clearCursorAt(x: number, y: number) {
    this.updateTile(this.tileAt(x, y), { cursor: false });
    this.updateTile(this.tileAt(x+1, y), { cursor: false });
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
  }

  public randomizeFirstRow() {
    const rows = this.state.rows;
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
      this.updateTile(row[j], {
        cursor: false,
        tileType,
      });
    }
  }

  updateTile(tileProps: TileProps, updates: Partial<TileProps>) {
    Object.assign(tileProps, updates);
    const rowsCopy = [...this.state.rows];
    this.setState({ rows: rowsCopy });
  }

  tileAt(x: number, y: number): TileProps {
    if (x >= Grid.COLUMN_COUNT ||
        y >= Grid.ROW_COUNT ||
        x < 0 ||
        y < 0) {
      throw new Error('out of bounds');
    }
    return this.state.rows[y][x];
  }

  rowAt(y: number) {
    if (y >= Grid.ROW_COUNT || y < 0) {
      throw new Error('out of bounds');
    }
    return this.state.rows[y];
  }

  columnAt(x: number) {
    let column = [];
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      column.push(this.tileAt(x, y));
    }
    return column;
  }

  swapTilesAt(x1: number, y1: number, x2: number, y2: number) {
    const tile1Props = this.tileAt(x1, y1);
    const tile2Props = this.tileAt(x2, y2);
    const tile1PropsCopy = Object.assign({}, tile1Props);
    this.updateTile(tile1Props, tile2Props);
    this.updateTile(tile2Props, tile1PropsCopy);
  }

  advanceRowsSmall() {
    const that = this;
    this.currentSubrow = (this.currentSubrow + 1) % Grid.SUBROWS_PER_ROW;
    const subrow = this.currentSubrow;
    this.state.rows.forEach(row => row.forEach(tile => {
      that.updateTile(tile, { subrow });
    }));
    if (subrow === 0) {
      this.advanceRows();
    }
  }

  /**
   * Bring the rows upwards by one and add a new row
   * of occupied tiles to the bottom.
   */
  advanceRows() {
    const that = this;
    const rows = this.state.rows;
    rows.forEach(row => row.forEach(tile => {
      that.updateTile(tile, { y: tile.y - 1 });
    }));
    const topRow = rows[0];
    const topRowTilesEmpty = topRow.every(tile =>
      tile.tileType === TILE_TYPE_EMPTY);
    if (topRowTilesEmpty) {
      // Top row is empty. It can be used as the new bottom row.
      rows.shift();
      rows.push(topRow);
      topRow.forEach(tile =>
        that.updateTile(tile, { y: rows.length - 1 }));
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