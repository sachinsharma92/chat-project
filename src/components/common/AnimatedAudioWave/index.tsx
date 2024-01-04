'use client';

import './AnimatedAudioWave.css';

/**
 * Animated audio wave for speech to text state
 * @returns
 */
const AnimatedAudioWave = () => {
  return (
    <div className="animated-audio-wave">
      <div className="animated-audio-wave-box-container">
        <div className="animated-audio-wave-box box1"></div>
        <div className="animated-audio-wave-box box2"></div>
        <div className="animated-audio-wave-box box3"></div>
        <div className="animated-audio-wave-box box4"></div>
        <div className="animated-audio-wave-box box5"></div>
      </div>
    </div>
  );
};

export default AnimatedAudioWave;
