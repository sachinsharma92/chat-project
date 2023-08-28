import { useEffect, useMemo, useRef } from 'react';
import { isEmpty } from 'lodash';
import { MusicPlayerMediaType } from '@/types';
import cx from 'classnames';
import './MediaBar.scss';

export type MediaBarProps = {
  mediaUrl: string;

  mediaType: MusicPlayerMediaType;
};

export const extractVideoIdFromUrl = (url: string) => {
  const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]+)/);
  return videoIdMatch ? videoIdMatch[1] : '';
};

export const covertoSpotifyEmbedUrl = (inputUrl: string) => {
  const urlObj = new URL(inputUrl);
  const segments = urlObj.pathname.split('/');

  const entityType = segments[1]; // Get the type: playlist, album, episode
  const entityId = segments[2]; // Get the ID

  const embedUrl = `https://open.spotify.com/embed/${entityType}/${entityId}`;

  return embedUrl;
};

const MediaBar = (props: MediaBarProps) => {
  const youtubeRef = useRef<HTMLIFrameElement | null>(null);
  const spotifyRef = useRef<HTMLIFrameElement | null>(null);
  const { mediaUrl, mediaType } = props;

  const isYoutube = useMemo(
    () => mediaType === MusicPlayerMediaType.youtube,
    [mediaType],
  );
  const isSpotify = useMemo(
    () => mediaType === MusicPlayerMediaType.spotify,
    [mediaType],
  );

  useEffect(() => {
    const youtubeDom = youtubeRef.current;
    const spotifyDom = spotifyRef.current;

    if (!isEmpty(mediaUrl) && isYoutube) {
      const videoId = extractVideoIdFromUrl(mediaUrl);

      if (youtubeDom) {
        youtubeDom.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

        if (spotifyDom) {
          spotifyDom.src = '';
        }
      }
    } else if (!isEmpty(mediaUrl) && isSpotify) {
      if (spotifyDom) {
        const embedUrl = covertoSpotifyEmbedUrl(mediaUrl);

        if (embedUrl) {
          spotifyDom.src = embedUrl;
        }

        if (youtubeDom) {
          youtubeDom.src = '';
        }
      }
    }
  }, [mediaUrl, isYoutube, isSpotify]);

  return (
    <div className="media-bar" data-testid={'MediaBarTestId'}>
      <div className="media-bar-content-type">
        <iframe
          ref={youtubeRef}
          width="100%"
          height="auto"
          src=""
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="YouTube"
          className={cx({ 'hide-document': !isYoutube })}
        />
        <iframe
          ref={spotifyRef}
          style={{ borderRadius: '12px', margin: '0', padding: '0' }}
          height={'160px'}
          width={'100%'}
          frameBorder="0"
          allowFullScreen={false}
          allow="autoplay; encrypted-media;"
          className={cx({ 'hide-document': !isSpotify })}
        ></iframe>
        {!isSpotify && !isYoutube && (
          <div className="media-bar-content-type-not-found">
            <p>404 not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaBar;
