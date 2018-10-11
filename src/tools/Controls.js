import React, { Component } from 'react';
import { Tween } from '../Tween';

class Controls extends Component {
  gsap: any;
  slider: any;
  sliderTouched: boolean;

  state = {
    totalProgress: 0,
    playState: Tween.playState.play,
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

  playStateStyle = {
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

  setPlayState = (state) => {
    this.setState({
      playState: state
    });
  }

  getControls = (totalProgress, playState) => (
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
          <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayState(Tween.playState.play)}>Play</button>
          <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayState(Tween.playState.reverse)}>Reverse</button>
          <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayState(Tween.playState.pause)}>Pause</button>
          <button type="button" style={this.buttonStyle} onClick={(e) => this.setPlayState(Tween.playState.stop)}>Stop</button>
        </div>
        <span style={this.playStateStyle}>{playState}</span>
      </div>
    </div>
  );

  render() {
    const {
      children,
    } = this.props;

    const {
      totalProgress,
      playState,
    } = this.state;

    const child = React.Children.only(children);

    if (child.type.displayName !== 'Tween' && child.type.displayName !== 'Timeline') {
      throw new Error('Controls component only allows a Tween or a Timeline component as direct child');
    }

    return (
      <div>
        {React.cloneElement(
          child,
          {
            ref: (target) => { this.gsap = target },
            playState,
          }
        )}
        {this.getControls(totalProgress, playState)}
      </div>
    );
  }
}

export { Controls };
