import { useForm } from 'react-hook-form';
import { isEmpty, isFunction, isString } from 'lodash';
import { MusicPlayerMediaType } from '@/types';
import Button from '../../common/Button';
import './MediaForm.scss';

export type MediaFormProps = {
  onMediaChange: (mediaType: MusicPlayerMediaType, url: string) => void;
};

export const isYouTubeUrl = (str: string) => {
  // eslint-disable-next-line
  const match =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

  return isString(str) && !isEmpty(str) && match.test(str);
};

export const isSpotifyPlaylist = (link: string) => {
  const pattern =
    /^https:\/\/open\.spotify\.com\/(?:album|playlist|embed)\/[a-zA-Z0-9]+(?:\?.*)?$/;
  return !isEmpty(link) && pattern.test(link);
};

export const defaultYoutubeUrl = 'https://www.youtube.com/watch?v=jfKfPfyJRdk';

const MediaForm = (props: MediaFormProps) => {
  const { onMediaChange } = props;
  const {
    register,
    handleSubmit,
    // setError,
    // watch,
    // formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const { mediaUrl } = data;
    const isYoutube = isYouTubeUrl(mediaUrl);
    const isSpotify = isSpotifyPlaylist(mediaUrl);

    if (!isFunction(onMediaChange)) {
      return;
    } else if (isEmpty(mediaUrl) || (!isSpotify && !isYoutube)) {
      onMediaChange(MusicPlayerMediaType.notFound, '');
      return;
    }

    onMediaChange(
      isYoutube ? MusicPlayerMediaType.youtube : MusicPlayerMediaType.spotify,
      mediaUrl,
    );
  };

  return (
    <div className="media-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          defaultValue={defaultYoutubeUrl}
          type="text"
          {...register('mediaUrl', { required: 'Media url is required.' })}
        />
        <Button type="submit" text="Save" />
      </form>
    </div>
  );
};

export default MediaForm;
