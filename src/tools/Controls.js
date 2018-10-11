import React, { Component } from 'react';
import { Tween } from '../Tween';

class Controls extends Component {
  gsap: any;
  slider: any;
  sliderTouched: boolean;

  state = {
    totalProgress: 0,
    playStatus: 'playing',
  }

  containerStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px 10px 0 10px',
    marginTop: '10px',
    position: 'relative',
    zIndex: '2',
    fontFamily: 'verdana, sans-serif',
    fontSize: '16px',
    border: '1px solid #ccc',
  }
  
  buttonContainerStyle = {
    margin: '0',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }

  buttonStyle = {
    border: '1px solid #999',
    backgroundColor: '#f0f0f0',
    padding: '5px',
    margin: '10px 10px 10px 0',
    cursor: 'pointer',
  }
  
  sliderStyle = {
    margin: '0',
    width: '100%',
  }

  playStatusStyle = {
    color: '#999',
    margin: '10px 0',
    fontSize: '14px',
  }

  componentDidMount() {
    this.slider.value = 0;
    this.gsap.getGSAP().eventCallback('onUpdate', this.onUpdate, null, this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.onUpdate();
  }

  onUpdate(event) {
    if (this.gsap && this.slider && !this.sliderTouched) {
      const totalProgress = this.gsap.getGSAP().totalProgress();
      this.slider.value = totalProgress * 100;
    }
  }

  onChange = (event) => {
    this.gsap.getGSAP().totalProgress(event.target.value / 100);
  }

  setPlayStatus = (status) => {
    this.setState({
      playStatus: status
    });
  }

  getControls = (totalProgress, playStatus) => (
    <div style={this.containerStyle}>
      <input
        ref={el => this.slider = el}
        type="range"
        style={this.sliderStyle}
        step="0.001"
        onChange={(e) => this.onChange(e)}
        onMouseDown={(e) => this.sliderTouched = true}
        onMouseUp={(e) => this.sliderTouched = false}
      />
      <div style={this.buttonContainerStyle}>
        <div>
          <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayStatus(Tween.playStatus.playing)}>Play</button>
          <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayStatus(Tween.playStatus.reverse)}>Reverse</button>
          <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayStatus(Tween.playStatus.paused)}>Pause</button>
          <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayStatus(Tween.playStatus.stopped)}>Stop</button>
        </div>
        <span style={this.playStatusStyle}>{playStatus}</span>
      </div>
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

    // TODO: allow only one child and Tween and Timeline

    const child = children(totalProgress, playStatus);

    return (
      <div>
        {React.cloneElement(
          child,
          {
            ref: (target) => { this.gsap = target }
          }
        )}
        {this.getControls(totalProgress, playStatus)}
      </div>
    );
  }
}

export { Controls };
