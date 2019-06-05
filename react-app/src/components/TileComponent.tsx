import * as React from 'react';
import './TileComponent.css';
import { Tile, TileState } from '../terminal/tile';

export interface TileProps {
  tile: Tile;
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface TileComponentState {
  cursor: boolean;
}

export class TileComponent
       extends React.Component<TileProps, TileComponentState> {
  static readonly INNER_TILE_OFFSET = 8;
  constructor(props: TileProps, state?: TileComponentState) {
    super(props, state);
    this.state = { cursor: false };
  }
  render() {
    this.props.tile.tileComponent = this;
    return (
      <div className={`tile ${this.classForTileState()}`}
           style={{
             top: this.props.top,
             left: this.props.left,
             height: this.props.height,
             width: this.props.width,
           }}>
        <div className='inner-tile'
             style={{
               top: TileComponent.INNER_TILE_OFFSET,
               left: TileComponent.INNER_TILE_OFFSET,
               height: this.props.height - TileComponent.INNER_TILE_OFFSET * 2,
               width: this.props.width - TileComponent.INNER_TILE_OFFSET * 2,
             }}/>
      </div>
    );
  }

  private classForTileState(): string {
    const cursorClass = this.state.cursor ? 'cursor' : '';
    if (this.props.tile.state === TileState.EMPTY) {
      //return 'empty';
    }
    return 'nonempty ' + cursorClass;
  }
}