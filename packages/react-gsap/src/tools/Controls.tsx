import React from 'react';
import Base from '../Base';
import { PlayState } from './../types';
import { setPlayState } from './../helper';

type ControlsProps = {
  playState?: PlayState;
};

type ControlsState = {
  totalProgress: number;
  playState: PlayState;
  prevPlayState?: PlayState;
};

class Controls extends Base<ControlsProps, ControlsState> {
  gsap: any;
  slider: any;
  sliderTouched: boolean = false;

  state = {
    totalProgress: 0,
    playState: PlayState.play,
    prevPlayState: undefined,
  };

  containerStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px 10px 0 10px',
    marginTop: '10px',
    position: 'relative' as 'relative',
    zIndex: 2,
    fontFamily: 'verdana, sans-serif',
    fontSize: '16px',
    border: '1px solid #ccc',
  };

  buttonContainerStyle = {
    margin: '0',
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'space-between',
  };

  buttonStyle = {
    border: '1px solid #999',
    backgroundColor: '#f0f0f0',
    padding: '5px',
    margin: '10px 10px 10px 0',
    cursor: 'pointer',
  };

  sliderStyle = {
    margin: '0',
    width: '100%',
  };

  playStateStyle = {
    color: '#999',
    margin: '10px 0',
    fontSize: '14px',
  };

  componentDidMount() {
    if (this.consumers.length) {
      this.gsap = this.consumers[0];
      this.gsap.getGSAP()?.eventCallback('onUpdate', this.onUpdate);

      if (this.props.playState) {
        this.setPlayState(this.props.playState);
      }
    }
  }

  componentDidUpdate() {
    this.onUpdate();
  }

  onUpdate = () => {
    if (this.gsap && this.slider && !this.sliderTouched) {
      const totalProgress = this.gsap.getGSAP().totalProgress();
      this.slider.value = totalProgress * 100;
    }
  };

  onChange = (event: any) => {
    this.gsap?.getGSAP()?.totalProgress(event.target.value / 100);
  };

  setPlayState = (state: PlayState) => {
    this.setState(prevState => {
      return {
        playState: state,
        prevPlayState: prevState.playState,
      };
    });
  };

  getControls = (_totalProgress: any, playState: PlayState) => (
    <div style={this.containerStyle}>
      <input
        ref={el => (this.slider = el)}
        type="range"
        style={this.sliderStyle}
        step="0.001"
        onChange={e => this.onChange(e)}
        onMouseDown={() => (this.sliderTouched = true)}
        onMouseUp={() => (this.sliderTouched = false)}
      />
      <div style={this.buttonContainerStyle}>
        <div>
          <button
            type="button"
            style={this.buttonStyle}
            onClick={() => this.setPlayState(PlayState.play)}
          >
            Play
          </button>
          <button
            type="button"
            style={this.buttonStyle}
            onClick={() => this.setPlayState(PlayState.reverse)}
          >
            Reverse
          </button>
          <button
            type="button"
            style={this.buttonStyle}
            onClick={() => this.setPlayState(PlayState.pause)}
          >
            Pause
          </button>
          <button
            type="button"
            style={this.buttonStyle}
            onClick={() => this.setPlayState(PlayState.stop)}
          >
            Stop
          </button>
        </div>
        <span style={this.playStateStyle}>{playState}</span>
      </div>
    </div>
  );

  render() {
    const { children } = this.props;
    const { totalProgress, playState, prevPlayState } = this.state;

    if (this.gsap) {
      setPlayState(playState, prevPlayState, this.gsap.getGSAP());
    }

    return this.renderWithProvider(
      <div>
        {children}
        {this.getControls(totalProgress, playState)}
      </div>
    );
  }
}

export default Controls;
