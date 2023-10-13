import { useBotnetAuth } from '@/store/Auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Avatar from '@/ui/common/Avatar/Avatar';
import './AccountInfo.css';
import TextInput from '@/ui/common/TextInput';
import Button from '@/ui/common/Button';
import { updateDisplayName } from '@/lib/supabase';

const AccountInfo = () => {
  const [userId, image, email, displayName, setDisplayName] = useBotnetAuth(
    state => [
      state?.session?.user?.id || '',
      state.image,
      state.email,
      state.displayName,
      state.setDisplayName,
    ],
  );
  const {
    register,
    handleSubmit,
    // setValue,
    watch,
    // formState: { errors },
  } = useForm();
  const [updating, setUpdating] = useState(false);

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

  return (
    <div className="account-info">
      <div className="account-avatar">
        <Button className="upload-avatar">
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
