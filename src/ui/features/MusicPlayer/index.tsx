import { useState } from 'react';
import { isNumber } from 'lodash';
import { MusicPlayerMediaType } from '@/types';
import MediaForm, { defaultYoutubeUrl } from './MediaForm';
import MediaBar from './MediaBar';
import MediaHeader from './MediaHeader';
import './MusicPlayer.scss';

const MusicPlayer = (props: { height?: number }) => {
  const { height } = props;
  const [mediaType, setMediaType] = useState(MusicPlayerMediaType.youtube);
  const [mediaUrl, setMediaUrl] = useState(defaultYoutubeUrl);

  const handleMediaChange = (type: MusicPlayerMediaType, url: string) => {
    setMediaType(type);
    setMediaUrl(url);
  };

  return (
    <div
      className="music-player"
      data-testid={'MusicPlayerTestId'}
      style={{
        ...(isNumber(height) && height > 0 && { height: `${height}px` }),
      }}
    >
      <MediaHeader />
      <MediaForm onMediaChange={handleMediaChange} />
      <MediaBar mediaType={mediaType} mediaUrl={mediaUrl} />
    </div>
  );
};

export default MusicPlayer;
