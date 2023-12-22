'use client';

import { useBotnetAuth } from '@/store/Auth';
import { InterTight } from '@/app/fonts';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import {
  getUserProfileByUsername,
  updateUserProfileProps,
} from '@/lib/supabase';
import { useAuth } from '@/hooks';
import { head, isEmpty, pick, size } from 'lodash';

import Avatar from '@/components/common/Avatar/Avatar';
import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import TextareaAutosize from 'react-textarea-autosize';
import Links from './Links';

import './CreatorProfile.css';
import { uploadImageAvatarFile } from '@/lib/utils/upload';
import { useToast } from '@/components/ui/use-toast';

const CreatorProfile = () => {
  const [
    image,
    displayName,
    username,
    bio,
    setDisplayName,
    setUsername,
    setBio,
    setImage,
  ] = useBotnetAuth(state => [
    state.image,
    state.displayName,
    state.username,
    state.bio,
    state.setDisplayName,
    state.setUsername,
    state.setBio,
    state.setImage,
  ]);

  const { userId } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [updating, setUpdating] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [error, setError] = useState('');

  const { toast } = useToast();

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

  /**
   * On profile update save
   * @param data
   * @returns
   */
  const onUpdate = async (data: any = {}) => {
    try {
      const updatedProps = pick(data, ['username', 'displayName', 'bio']);

      if (updating || !updatedProps || isEmpty(updatedProps)) {
        return;
      }

      if (
        username &&
        displayName &&
        updatedProps?.username === username &&
        updatedProps?.displayName === displayName &&
        updatedProps?.bio === bio
      ) {
        // no changes
        return;
      }

      if (updatedProps?.username && size(updatedProps?.username) < 3) {
        setError('Username must contain at least 3 characters.');
        return;
      }

      if (
        !isEmpty(updatedProps?.username) &&
        updatedProps?.username !== username
      ) {
        const targetUserProfilesByUsername = await getUserProfileByUsername(
          updatedProps.username,
        );
        const targetProfileWithUsername = head(
          targetUserProfilesByUsername?.data,
        );

        // check if username is taken
        if (targetProfileWithUsername && !isEmpty(targetProfileWithUsername)) {
          setError('Username is already taken.');
          return;
        }
      }

      setError('');
      setUpdating(true);

      const { error } = await updateUserProfileProps(userId, {
        ...updatedProps,
      });

      if (!error?.message) {
        if (!isEmpty(updatedProps?.displayName)) {
          setDisplayName(updatedProps.displayName);
        }

        if (!isEmpty(updatedProps?.username)) {
          setUsername(updatedProps.username);
        }

        if (!isEmpty(updatedProps?.bio)) {
          setBio(updatedProps.bio);
        }
      }
    } catch (err: any) {
      console.log('onUpdate() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const errorMessage = useMemo(
    () =>
      error ||
      errors?.displayName?.message?.toString() ||
      errors?.username?.message?.toString(),
    [errors, error],
  );

  /**
   * Set input value property
   */
  useEffect(() => {
    if (displayName) {
      setValue('displayName', displayName);
    }

    if (username) {
      setValue('username', username);
    }

    if (bio) {
      setValue('bio', bio);
    }
  }, [displayName, username, bio, setValue]);

  return (
    <div className="creator-profile">
      <h1 className={InterTight.className}> Profile </h1>

      <form onSubmit={handleSubmit(onUpdate)}>
        <section>
          <h2>Photo</h2>
          <div className="relative w-full flex justify-start items-center mt-[8px]">
            <Avatar
              className="creator-profile-avatar"
              height={64}
              width={64}
              src={image}
              name={displayName}
            />
            <Button className="change-photo" onClick={onAccountAvatarUpdate}>
              Change Photo
            </Button>
          </div>
        </section>

        <section>
          <h2>Name</h2>
          <TextInput
            {...register('displayName', {
              value: displayName,

              required: 'Name is required',
            })}
          />
        </section>

        <section>
          <h2>Username</h2>

          <TextInput
            {...register('username', {
              value: username,
              required: 'Username is required',
            })}
          />
        </section>

        <section>
          <h2>Bio</h2>
          <TextareaAutosize
            maxLength={240}
            maxRows={5}
            minRows={3}
            {...register('bio', {
              value: bio,
            })}
          />
        </section>

        <section className="mb-2">
          <h2>Links </h2>

          <div className="relative w-[500px] box-border">
            <Links />
          </div>
        </section>

        {!isEmpty(errorMessage) && (
          <div className="settings-cta-error">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="settings-cta">
          <Button type="submit" isLoading={updating}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatorProfile;
