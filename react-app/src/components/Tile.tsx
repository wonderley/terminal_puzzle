import * as React from 'react';
import './Tile.css';
import Grid from './Grid';

export interface TileProps {
  x: number;
  y: number;
  height: number;
  width: number;
  subrow: number;
  cursor: boolean;
  tileType: TileType;
}

export const TILE_TYPE_EMPTY: string = 'empty';
export const TILE_TYPE_MARKED: string = 'marked';
export type TileType = 'empty' | 'marked' | 'a' | 'b' | 'c' | 'd';

export class Tile
       extends React.Component<TileProps> {

  static readonly NONEMPTY_TILE_STATE_COUNT = 4;
  static readonly INNER_TILE_OFFSET = 8;
  static readonly NONEMPTY_TYPES: TileType[] = ['a', 'b', 'c', 'd'];
  static readonly TILE_BORDER_WIDTH = 2;

  render() {
    return (
      <div className={`tile ${this._classForTileProps()}`}
           style={{
             top: this._top(),
             left: this._left(),
             height: this.props.height,
             width: this.props.width,
           }}>
        <div className='inner-tile'
             style={{
               top: Tile.INNER_TILE_OFFSET,
               left: Tile.INNER_TILE_OFFSET,
               height: this.props.height - Tile.INNER_TILE_OFFSET * 2,
               width: this.props.width - Tile.INNER_TILE_OFFSET * 2,
             }}/>
      </div>
    );
  }

  private _classForTileProps(): string {
    return `${this.props.tileType} ${this.props.cursor ? 'cursor' : ''}`;
  }

  private _top(): number {
    const fullHeight = this._fullHeight();
    // Add 1 to push hidden row below the grid
    return fullHeight * (this.props.y + 1)
      // Subtract subrow
      - fullHeight / Grid.SUBROWS_PER_ROW * this.props.subrow
      // Up a bit more
      - fullHeight / Grid.SUBROWS_PER_ROW;
  }

  private _fullHeight(): number {
    return this.props.height + Tile.TILE_BORDER_WIDTH;
  }
  
  private _left(): number {
    return this._fullHeight() * this.props.x;
  }
}