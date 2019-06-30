import React from 'react';
import './Score.css';

export interface ScoreProps {
  scoreDidMount: (score: Score) => void,
}

export interface ScoreState {
  score: number;
}

export class Score extends React.Component<ScoreProps, ScoreState> {

  constructor(params: ScoreProps) {
    super(params);
    this.state = { score: 0 };
  }

  render() {
    return <span className="score">Score: {this.state.score}</span>;
  }
  
  componentDidMount() {
    this.props.scoreDidMount(this);
  }
}