import './Avatar.css';

function Avatar() {
  return (
    <div className="avatar-layout">
      <img
        src={'/assets/avatarImage.svg'}
        className="avatar"
        alt="Avatar Image"
      />
    </div>
  );
}

export default Avatar;
