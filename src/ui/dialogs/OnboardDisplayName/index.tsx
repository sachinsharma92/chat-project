import { useForm } from 'react-hook-form';
import { Inter, InterTight } from '@/app/fonts';
import { useBotnetAuth } from '@/store/Auth';
import cx from 'classnames';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import DialogCloseButton from '@/components/common/DialogCloseButton';

import './OnboardDisplayName.css';
import { updateUserProfileProps } from '@/lib/supabase';
import { toString } from 'lodash';
import { useState } from 'react';
import { useAppStore } from '@/store/Spaces';
import { DialogEnums } from '@/types/dialog';

const OnboardDisplayName = () => {
  const {
    register,
    handleSubmit,
    // setValue,
    // watch,
    formState: { errors },
  } = useForm();

  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);
  const [userId, displayName, setDisplayName] = useBotnetAuth(state => [
    state?.session?.user?.id as string,
    state.displayName,
    state.setDisplayName,
  ]);
  const [updating, setUpdating] = useState(false);

  const onUpdateDisplayName = async (data: any = {}) => {
    try {
      const { displayName: updatedDisplayName } = data;

      if (!userId || updatedDisplayName === displayName) {
        // close dialog
        setShowDialog(false, DialogEnums.none);
        return;
      }

      if (updating) {
        return;
      }

      if (!updatedDisplayName) {
        return;
      }

      setUpdating(true);
      await updateUserProfileProps(userId, { displayName: updatedDisplayName });
      setDisplayName(updatedDisplayName);
      setShowDialog(false, DialogEnums.none);
    } catch (err: any) {
      console.log('onUpdateDisplayName() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={cx(Inter.className, 'onboard-display-name')}>
      <div className={cx(InterTight.className, 'label')}>
        <p> Update your display name</p>
      </div>
      <form onSubmit={handleSubmit(onUpdateDisplayName)}>
        <TextInput
          className="input-display-name"
          maxLength={40}
          {...register('displayName', {
            required: 'Name should not be empty!',
            value: displayName,
          })}
        />

        <div className="input-error">
          <p>{toString(errors?.displayName?.message)}</p>
        </div>
        <Button
          isLoading={updating}
          className="submit-button"
          variant="primary"
          type="submit"
        >
          <p> {'Submit'}</p>
        </Button>
      </form>

      <DialogCloseButton />
    </div>
  );
};

export default OnboardDisplayName;
