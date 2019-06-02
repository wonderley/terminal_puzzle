import * as React from 'react';
import './GridComponent.css';

export interface GridProps {
  name: string;
}

export class GridComponent extends React.Component<GridProps> {
  render() {
    return (
      <div className="grid-component">
      </div>
    );
  }
}

export default GridComponent;