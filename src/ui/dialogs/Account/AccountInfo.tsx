import { useBotnetAuth } from '@/store/Auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateDisplayName, updateUserImageUrl } from '@/lib/supabase';
import { uploadImageAvatarFile } from '@/lib/utils/upload';
import { isEmpty } from 'lodash';
import { useToast } from '@/components/ui/use-toast';
import Avatar from '@/components/common/Avatar/Avatar';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import './AccountInfo.css';

const AccountInfo = () => {
  const [userId, image, email, displayName, setDisplayName, setImage] =
    useBotnetAuth(state => [
      state?.session?.user?.id || '',
      state.image,
      state.email,
      state.displayName,
      state.setDisplayName,
      state.setImage,
    ]);
  const {
    register,
    handleSubmit,
    // setValue,
    watch,
    // formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onUpdate = async (data: any = {}) => {
    try {
      const { displayName: updatedDisplayName } = data;

      if (updating || updatedDisplayName === displayName) {
        return;
      }

      setUpdating(true);

      if (updatedDisplayName) {
        await updateDisplayName(userId, updatedDisplayName);
        setDisplayName(updatedDisplayName);
      }
    } catch (err: any) {
      console.log('onUpdate() err', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const showUpdatebutton =
    watch('displayName') && watch('displayName') !== displayName;

  /**
   * Trigger file input and upload selected image
   * @returns
   */
  const onAccountAvatarUpdate = async () => {
    if (uploading) {
      return;
    }

    try {
      const url = await uploadImageAvatarFile(
        () => setUploading(true),
        () => setUploading(false),
      );

      if (!isEmpty(url) && url) {
        // store url on supabase db
        setImage(url);
        await updateUserImageUrl(userId, url);
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to upload.',
      });
    }
  };

  return (
    <div className="account-info">
      <div className="account-avatar">
        <Button
          isLoading={uploading}
          className="upload-avatar"
          onClick={onAccountAvatarUpdate}
        >
          <Avatar height={80} width={80} src={image} name={displayName} />
        </Button>
      </div>
      <form onSubmit={handleSubmit(onUpdate)} className="account-form">
        <div className="account-display-name">
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
        <div className="account-email">
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

        {showUpdatebutton && (
          <Button
            isLoading={updating}
            className="update-button"
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

export default AccountInfo;
