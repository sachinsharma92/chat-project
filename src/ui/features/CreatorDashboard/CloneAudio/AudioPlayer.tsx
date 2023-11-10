import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/App';
import { DialogEnums } from '@/types/dialog';

import './AudioPlayer.css';

const AudioPlayer = (props: { audioSrc: string }) => {
  const { audioSrc } = props;
  const [showDialogType] = useAppStore(state => [state.showDialogType]);
  const [, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  //   const togglePlayPause = () => {
  //     if (audioRef?.current) {
  //       if (isPlaying) {
  //         audioRef.current.pause();
  //       } else {
  //         audioRef.current.play();
  //       }

  //       setIsPlaying(!isPlaying);
  //     }
  //   };

  //   const skipTime = (seconds: number) => {
  //     if (audioRef.current) {
  //       audioRef.current.currentTime += seconds;
  //     }
  //   };

  /**
   * Pause audio when modal is active
   */
  useEffect(() => {
    if (audioRef.current && showDialogType !== DialogEnums.none) {
      audioRef.current?.pause();
    }
  }, [showDialogType]);

  /**
   * Set audio source
   */
  useEffect(() => {
    if (audioRef.current?.src && audioRef.current?.src !== audioSrc) {
      audioRef.current.pause();
      audioRef.current.setAttribute('src', audioSrc);
      audioRef.current.play();
    }
  }, [audioSrc]);

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={audioSrc}
        controls
        onEnded={() => setIsPlaying(false)}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
