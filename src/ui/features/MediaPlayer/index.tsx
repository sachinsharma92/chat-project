import Button from '@/ui/common/Button';
import { AudioPlayingIcon } from '@/icons';
import './MediaPlayer.css';
import '../../common/styles/Button.css';

const MediaPlayer = () => {
  return (
    <div className="media-player">
      <div className="album">
        <img src="/assets/song-cover-art.jpg" alt="Audio album cover" />
      </div>
      <div className="album-info flex-col items-start justify-center">
        <p>Levitating</p>
        <p>Dua Lipa</p>
      </div>
      <Button className="play-toggle dark-button">
        <AudioPlayingIcon />
      </Button>
    </div>
  );
};

export default MediaPlayer;
