import * as React from 'react';
import './GridComponent.css';
import { GridView } from '../terminal/grid_view';
import { InputDelegate } from '../terminal/input_delegate';

export interface GridProps {
  name: string;
}

export class GridComponent
       extends React.Component<GridProps>
       implements GridView {
  render() {
    return (
      <div className="grid-component">
      </div>
    );
  }
  initializeView(): void {
  }
  updateView(): void {
  }
  drawCursorAt(x: number, y: number): void {
  }
  clearCursorAt(x: number, y: number): void {
  }
  setInputDelegate(inputDelegate: InputDelegate): void {
  }
}

export default GridComponent;