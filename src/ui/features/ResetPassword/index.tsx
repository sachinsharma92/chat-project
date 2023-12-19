'use client';

import { isEmpty, size } from 'lodash';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { minPasswordLength } from '@/constants';
import { supabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { defaultSpaceId } from '@/store/AuthProvider';
import { timeout } from '@/lib/utils';

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import './ResetPassword.css';

/**
 * Enable user to reset/update their password
 * @returns
 */
const ResetPassword = () => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  const onPasswordReset = async (data: any) => {
    try {
      if (updating) {
        return;
      }

      if (
        !data ||
        !data?.newPassword ||
        size(data?.newPassword) < minPasswordLength
      ) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      setUpdating(true);

      await supabaseClient.auth.updateUser({ password: data.newPassword });
      await timeout(1_000);

      // successfully updated
      // redirect user to default space
      setValue('newPassword', '');
      router.push('/?space=' + defaultSpaceId);
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setError('');
      setUpdating(false);
    }
  };

  const errorMessage = useMemo(
    () => error || errors?.newPassword?.message?.toString() || '',
    [error, errors],
  );

  return (
    <div className="reset-password-feature">
      <div className="reset-password-content">
        <div className="reset-password-label">
          <h1>Reset your password</h1>
        </div>

        <form
          className="relative w-full"
          onSubmit={handleSubmit(onPasswordReset)}
        >
          <TextInput
            className="reset-password-input"
            {...register('newPassword', {
              required: 'Password is required.',
            })}
            type="password"
            placeholder="Your new password"
          />

          {!isEmpty(errorMessage) && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}

          <Button
            type="submit"
            className="submit-reset-password"
            ariaLabel="Submit new password"
            isLoading={updating}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
