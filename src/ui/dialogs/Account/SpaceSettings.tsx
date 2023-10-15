import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import Avatar from '@/components/common/Avatar/Avatar';
import { UploadIcon } from '@radix-ui/react-icons';
import { useSpacesStore } from '@/store/Spaces';
import { useMemo, useState } from 'react';
import { filter, head, isEmpty } from 'lodash';
import { useBotnetAuth } from '@/store/Auth';
import { useForm } from 'react-hook-form';
import { uploadImageAvatarFile } from '@/lib/utils/upload';
import { useToast } from '@/components/ui/use-toast';
import { updateSpaceProfileProperties } from '@/lib/supabase';
import './SpaceSettings.css';

const SpaceSettings = () => {
  const {
    register,
    handleSubmit,
    // setValue,
    watch,
    // formState: { errors },
  } = useForm();

  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, displayName] = useBotnetAuth(state => [
    state?.session?.user?.id || '',
    state.displayName,
  ]);
  const [spaces, setSpaceInfo] = useSpacesStore(state => [
    state.spaces,
    state.setSpaceInfo,
  ]);
  // owned space, not necessarily active/selected
  const spaceInfo = useMemo(() => {
    const find = filter(
      spaces,
      space => !isEmpty(space?.id) && space?.owner === userId,
    );
    return head(find);
  }, [spaces, userId]);
  // owned space id
  const spaceId = useMemo(() => {
    return spaceInfo?.id as string;
  }, [spaceInfo]);

  const { toast } = useToast();

  const onSpaceAvatarUpload = async () => {
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
        setSpaceInfo(spaceId, { image: url });
        await updateSpaceProfileProperties(spaceId, { image: url });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to upload.',
      });
    }
  };

  const onSpaceSettingsUpdate = async (data: any) => {
    try {
      const { spaceName: updatedSpaceName } = data;

      if (updating || updatedSpaceName === spaceInfo?.spaceName) {
        return;
      }

      setUpdating(true);

      if (updatedSpaceName) {
        const { error } = await updateSpaceProfileProperties(spaceId, {
          spaceName: updatedSpaceName,
        });

        if (!error) {
          setSpaceInfo(spaceId, { spaceName: updatedSpaceName });
        }
      }
    } catch (err: any) {
      console.log('onSpaceSettingsUpdate() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const showUpdatebutton =
    watch('spaceName') && watch('spaceName') !== spaceInfo?.spaceName;

  return (
    <div className="space-settings">
      <div className="space-avatar">
        <Button
          className="space-avatar-upload"
          isLoading={uploading || updating}
        >
          <Avatar
            height={80}
            width={80}
            src={spaceInfo?.image}
            name={spaceInfo?.spaceName || displayName}
          />
        </Button>

        {!uploading && (
          <Button
            onClick={onSpaceAvatarUpload}
            variant="primary"
            className="space-avatar-upload-button"
          >
            <UploadIcon />
            <p>Upload image</p>
          </Button>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSpaceSettingsUpdate)}
        className="space-settings-form"
      >
        <div className="space-name">
          <label className="label" htmlFor="displayName">
            Display name
          </label>
          <TextInput
            className="input"
            variant="primary"
            maxLength={40}
            placeholder={`${displayName} Space`}
            {...register('spaceName', {
              required: 'Space name should not be empty!',
              value: spaceInfo?.spaceName,
            })}
          />
        </div>
        <div className="space-description"></div>

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

export default SpaceSettings;
