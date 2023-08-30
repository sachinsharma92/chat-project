import { head, isEmpty, toString } from 'lodash';
import './Avatar.css';

type AvatarComponentProps = {
  src?: string;
  name?: string;
  ariaLabel?: string;
};

function Avatar(props: AvatarComponentProps) {
  const { src, name, ariaLabel } = props;

  return (
    <div
      className="avatar-layout flex justify-center"
      aria-label={!isEmpty(ariaLabel) ? ariaLabel : 'Avatar'}
    >
      {!isEmpty(src) && (
        <img src={src} className="avatar-image" alt="Avatar Image" />
      )}
      {!src && <p className="flex justify-center">{head(toString(name))}</p>}
    </div>
  );
}

export default Avatar;
