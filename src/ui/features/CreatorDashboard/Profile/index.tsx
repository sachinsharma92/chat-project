import { useMemo, useState } from 'react';
import { useBotnetAuth } from '@/store/Auth';
import { isEmpty, isString, toString } from 'lodash';
import { UploadIcon } from 'lucide-react';

import Avatar from '@/components/common/Avatar/Avatar';
import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';

import { useForm } from 'react-hook-form';
import { updateUserProfileProps } from '@/lib/supabase';
import { uploadImageAvatarFile } from '@/lib/utils/upload';
import { useToast } from '@/components/ui/use-toast';

import './Profile.css';

const Profile = (props: {
  className?: string;
  avatarHeight?: number;
  avatarWidth?: number;
}) => {
  // edit mode by default
  const { className, avatarHeight, avatarWidth } = props;

  const [userId, image, email, displayName, setDisplayName, setImage] =
    useBotnetAuth(state => [
      state?.session?.user?.id || '',
      state.image,
      state.email,
      state.displayName,
      state.setDisplayName,
      state.setImage,
    ]);

  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    // setValue,
    watch,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();

  const onUpdate = async (data: any) => {
    try {
      const { displayName: updatedDisplayName } = data;

      if (updating || updatedDisplayName === displayName) {
        return;
      }

      setUpdating(true);

      if (updatedDisplayName) {
        await updateUserProfileProps(userId, {
          displayName: updatedDisplayName,
        });
        setDisplayName(updatedDisplayName);
      }
    } catch (err: any) {
      console.log('onUpdate() err', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const onAccountAvatarUpdate = async () => {
    if (uploadingAvatar) {
      return;
    }

    try {
      const url = await uploadImageAvatarFile(
        () => setUploadingAvatar(true),
        () => setUploadingAvatar(false),
      );

      if (!isEmpty(url) && url) {
        // store url on supabase db
        setImage(url);
        await updateUserProfileProps(userId, { image: url });
      }
    } catch (err) {
      toast({
        duration: 1_500,
        variant: 'destructive',
        title: 'Failed to upload.',
      });
    }
  };

  const showUpdatebutton =
    watch('displayName') && watch('displayName') !== displayName;

  /** Form error message */
  const errorMessage = useMemo(() => {
    return errors?.displayName?.message?.toString() || '';
  }, [errors]);

  return (
    <div
      className={`profile${
        isString(className) && !isEmpty(className) ? ` ${className}` : ''
      }`}
    >
      <div className="profile-avatar">
        <Button
          isLoading={uploadingAvatar}
          className="upload-avatar"
          onClick={onAccountAvatarUpdate}
        >
          <Avatar
            height={avatarHeight || 80}
            width={avatarWidth || 80}
            src={image}
            name={displayName}
          />
        </Button>

        {!uploadingAvatar && (
          <Button
            onClick={onAccountAvatarUpdate}
            variant="primary"
            className="upload-avatar-button"
          >
            <UploadIcon height={16} width={16} />
            <p>Upload image</p>
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit(onUpdate)} className="profile-form">
        <div className="profile-display-name">
          <label className="label" htmlFor="displayName">
            Display name
          </label>
          <TextInput
            className="input"
            variant="primary"
            maxLength={40}
            {...register('displayName', {
              required: 'Name should not be empty!',
              value: displayName,
            })}
          />
        </div>

        <div className="profile-email">
          <label className="label" htmlFor="email">
            Email
          </label>

          <TextInput
            className="input"
            variant="primary"
            // @ts-ignore
            readOnly
            defaultValue={email}
          />
        </div>

        {!isEmpty(errorMessage) && (
          <div className="profile-input-error">
            <p>{toString(errorMessage)}</p>
          </div>
        )}

        {showUpdatebutton && (
          <Button
            isLoading={updating}
            className="profile-update-button"
            variant={'primary'}
            type="submit"
          >
            <p>Update </p>
          </Button>
        )}
      </form>
    </div>
  );
};

export default Profile;
