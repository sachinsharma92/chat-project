'use client';

import { useForm } from 'react-hook-form';
import { isEmpty, trim } from 'lodash';
import { useMemo, useState } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { useBotnetAuth } from '@/store/Auth';
import * as EmailValidator from 'email-validator';

import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';

import './ForgotPassword.css';

const ForgotPassword = () => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();
  const [authIsLoading] = useBotnetAuth(state => [state.isLoading]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const isLoading = useMemo(
    () => authIsLoading || sending,
    [authIsLoading, sending],
  );

  const handleSubmitForgotPassword = async (data: any) => {
    try {
      if (sending) {
        return;
      }

      setShowSuccessMessage(false);

      if (!EmailValidator.validate(trim(data?.email))) {
        setError('Invalid email.');
        return;
      }

      setSending(true);
      const email = trim(data?.email);
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setError(error.message);
      } else {
        setValue('email', '');
        setShowSuccessMessage(true);
      }
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setSending(false);
    }
  };

  const errorMessage = useMemo(
    () => error || errors?.newPassword?.message?.toString() || '',
    [error, errors],
  );

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="forgot-password-label">
          <h1>Recover your account</h1>
        </div>
        <form
          onSubmit={handleSubmit(handleSubmitForgotPassword)}
          className="relative w-full box-border mt-[8px]"
        >
          <p className="relative w-full box-border mt-[8px] mb-[8px] text-[15px] text-center">
            Please enter the email address associated with your account.
          </p>
          <TextInput
            className="forgot-password-input"
            {...register('email', {
              required: 'Email is required.',
              onChange() {
                if (showSuccessMessage) {
                  setShowSuccessMessage(false);
                }
              },
            })}
            placeholder="youremail@domain.com"
          />

          {!isEmpty(errorMessage) && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}

          {showSuccessMessage && (
            <p className="success-sent">Successfully sent!</p>
          )}

          <Button
            type="submit"
            className="submit-forgot-password"
            ariaLabel="Submit new password"
            isLoading={isLoading}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
