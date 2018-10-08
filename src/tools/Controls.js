import React, { Component } from 'react';
import { Tween } from '../Tween';

class Controls extends Component {
  state = {
    totalProgress: 0,
    playStatus: 'playing',
  }

  containerStyle = {
    backgroundColor: '#555',
    padding: '10px',
    marginTop: '10px',
    display: 'flex',
  }

  buttonStyle = {
    border: '0',
    backgroundColor: '#f0f0f0',
    padding: '5px',
    marginLeft: '10px',
  }

  playStatusStyle = {
    marginLeft: '20px',
    color: '#f0f0f0',
  }

  onChange = (event) => {
    this.setState({
      totalProgress: event.target.value / 100,
    });
  }

  setPlayStatus = (status) => {
    this.setState({
      playStatus: status
    });
  }

  getControls = (totalProgress, playStatus) => (
    <div style={this.containerStyle}>
      <input type="range" value={totalProgress * 100} onChange={(e) => this.onChange(e)} />
      <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayStatus(Tween.playStatus.playing)}>Play</button>
      <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayStatus(Tween.playStatus.paused)}>Pause</button>
      <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayStatus(Tween.playStatus.stopped)}>Stop</button>
      <span style={this.playStatusStyle}>{playStatus}</span>
    </div>
  );

  render() {
    const {
      children,
    } = this.props;

    const {
      totalProgress,
      playStatus,
    } = this.state;

    const childrenCalled = children(totalProgress, playStatus);

    return (
      <div>
        {childrenCalled}
        {this.getControls(totalProgress, playStatus)}
      </div>
    );
  }
}

export { Controls };
