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

export class TileComponent
       extends React.Component<TileProps> {
  render() {
    return (
      <div className={`tile ${this.classForTileState()}`}
           style={{
             top: this.props.top,
             left: this.props.left,
             height: this.props.height,
             width: this.props.width,
           }}
      />
    );
  }

  private classForTileState(): string {
    if (this.props.tile.state === TileState.EMPTY) {
      //return 'empty';
    }
    return 'nonempty';
  }
}