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
  onComponentDidMount: (gridComponent: Grid) => void,
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
  rows: TileProps[][] = [];

  constructor(props: GridProps) {
    super(props);
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      this.rows.push([]);
      for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        this.rows[y].push({
          x: x,
          y: y,
          height: 0,
          width: 0,
          subrow: 0,
          cursor: false,
          markedToClear: false,
          tileType: 'empty',
        });
      }
    }
  }

  render() {
    const tileHeight = this.props.height / Grid.ROW_COUNT;
    const tileWidth = this.props.width / Grid.COLUMN_COUNT;
    const tiles: JSX.Element[] = [];
    for (let y = 0; y < Grid.ROW_COUNT; ++y) {
      for (let x = 0; x < Grid.COLUMN_COUNT; ++x) {
        const props = this.rows[y][x];
        tiles.push(<Tile
                    x={props.x} y={props.y}
                    height={tileHeight} width={tileWidth}
                    subrow={props.subrow} cursor={props.cursor}
                    markedToClear={props.markedToClear}
                    tileType={props.tileType} />);
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

  drawCursorAt(x: number, y: number) {
    this.tileAt(x, y).cursor = true;
    this.tileAt(x+1, y).cursor = true;
  }

  clearCursorAt(x: number, y: number) {
    this.tileAt(x, y).cursor = false;
    this.tileAt(x+1, y).cursor = false;
  }

  advanceGame() {
    this.advanceRowsSmall();
    if (this.currentSubrow === 0) {
      // Assume that the rows have just advanced to the next row.
      // Move the cursor to the next row.
      if (this.cursor.getY() > 0) {
        this.cursor.setPosition(this.cursor.getX(), this.cursor.getY() - 1);
      }
    }
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
      row[j].cursor = false;
      row[j].tileType = tileType;
    }
  }
  tileAt(x: number, y: number): TileProps {
    if (x >= Grid.COLUMN_COUNT ||
        y >= Grid.ROW_COUNT ||
        x < 0 ||
        y < 0) {
      throw new Error('out of bounds');
    }
    return this.rows[y][x];
  }
  tiles(): TileProps[] {
    return (this.props.children as TileProps[]);
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
    const rows = this.rows;
    let tile1 = rows[y1][x1];
    rows[y1][x1] = rows[y2][x2];
    rows[y2][x2] = tile1;
  }
  advanceRowsSmall() {
    this.currentSubrow = (this.currentSubrow + 1) % Grid.SUBROWS_PER_ROW;
    const currentSubrow = this.currentSubrow;
    this.rows.forEach(row => 
         row.forEach(tile => tile.subrow = currentSubrow));
    if (this.currentSubrow === 0) {
      this.advanceRows();
    }
  }
  /**
   * Bring the rows upwards by one and add a new row
   * of occupied tiles to the bottom.
   */
  advanceRows() {
    const rows = this.rows;
    rows.forEach(row => row.forEach(tile => tile.y--));
    const topRow = rows[0];
    const topRowTilesEmpty = topRow.every(tile => tile.tileType === TILE_TYPE_EMPTY);
    if (topRowTilesEmpty) {
      // Top row is empty. It can be used as the new bottom row.
      debugger;
      rows.shift();
      rows.push(topRow);
      topRow.forEach(tile => tile.y = rows.length - 1);
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
}

export default Grid;