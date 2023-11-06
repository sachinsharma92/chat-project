'use client';

import { Inter } from '@/app/fonts';
import TextInput from '@/components/common/TextInput';
import cx from 'classnames';
import Button from '@/components/common/Button';
import Image from 'next/image';
import Avatar from '@/components/common/Avatar/Avatar';
import Link from 'next/link';
import * as EmailValidator from 'email-validator';
import './CustomAuth.css';

import { useEffect, useMemo, useState } from 'react';
import { BotnetIcon, GithubLogoIcon } from '@/icons';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { isEmpty, toString } from 'lodash';
import { AuthSection } from '@/app/auth/page';
import { postEmailWaitlist, supabaseClient } from '@/lib/supabase';
import { RedirectTo } from '@supabase/auth-ui-shared';
import { useBotnetAuth } from '@/store/Auth';
import { useRouterQuery } from '@/hooks';
import { isProduction } from '@/lib/environment';
import { CheckCircledIcon } from '@radix-ui/react-icons';

/**
 * Custom auth page
 * Shows log in or sign up flow
 * @returns
 */
const CustomAuth = (props: { defaultSection?: AuthSection }) => {
  const { defaultSection } = props;
  const [authSectionPick, setAuthSectionPick] = useState<AuthSection>(
    defaultSection || AuthSection.entry,
  );
  const router = useRouter();
  const [authIsLoading, setIsLoading] = useBotnetAuth(state => [
    state.isLoading,
    state.setIsLoading,
  ]);
  const pathname = usePathname();
  const { navigate, searchParams, removeQuery } = useRouterQuery();
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');

  /**
   * Login flow
   */
  const pickLoginSection = () => {
    setAuthSectionPick(AuthSection.login);
    const values = getValues();
    const email = values?.email;
    router.push(
      '/login/' + (email ? `?email=${encodeURIComponent(email)}` : ''),
    );
  };

  /**
   * Sign up flow
   */
  const pickSignUpSection = () => {
    setAuthSectionPick(AuthSection['sign-up']);
    const values = getValues();
    const email = values?.email;
    router.push(
      '/register/' + (email ? `?email=${encodeURIComponent(email)}` : ''),
    );
  };

  const submitAuth = async (data: any) => {
    if (!data || isEmpty(data) || submitted) {
      return;
    }

    const { email, password } = data;

    try {
      if (!EmailValidator.validate(email)) {
        setError('Invalid email address.');
        return;
      }

      setSubmitted(true);

      if (authSectionPick === AuthSection.login) {
        // for log in
        const { error: signInError } =
          await supabaseClient.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) {
          setError(signInError.message);
        } else {
          navigate('/');
          // let AuthProvider.tsx handle auth changes
          setIsLoading(true);
        }
      } else if (isProduction && authSectionPick === AuthSection['sign-up']) {
        // waitlist for prod env
        const { error: waitlistError } = await postEmailWaitlist(email);

        if (!waitlistError?.message) {
          // success
          setValue('email', '');
          setSuccessMessage("You're on the waitlist!");
        } else {
          setError(waitlistError?.message?.toString());
        }
      } else if (authSectionPick === AuthSection['sign-up']) {
        const options: { emailRedirectTo: RedirectTo; data?: object } = {
          emailRedirectTo: '',
        };
        options.data = {};
        const {
          data: { session: signUpSession },
          error: signUpError,
        } = await supabaseClient.auth.signUp({
          email,
          password,
          options,
        });

        if (signUpError) {
          setError(signUpError.message);
        }

        if (!isEmpty(signUpSession)) {
          // success
          // redirect
          navigate('/');
          // let AuthProvider.tsx handle auth changes
          setIsLoading(true);
        }
      }
    } catch (err: any) {
      console.log('submitAuth() err:', err?.message);
    } finally {
      setSubmitted(false);
    }
  };

  const errorMessage = useMemo(
    () =>
      error ||
      toString(errors?.email?.message || errors?.password?.message || ''),
    [errors, error],
  );

  /**
   * Remove email parameter for log in or sign up
   * This is use to prefill email input
   */
  useEffect(() => {
    if (
      !isEmpty(searchParams.get('email')) &&
      (pathname?.startsWith('/login') || pathname?.startsWith('/register'))
    ) {
      removeQuery('email', '');
    }
  }, [removeQuery, pathname, searchParams]);

  return (
    <div className="custom-auth">
      <div className="custom-auth-header">
        <div className="app-logo">
          <BotnetIcon height={30} width={30} />
        </div>
      </div>

      <div className="custom-auth-left">
        <Image
          alt="auth background placeholder"
          src={'/assets/auth-character-placeholder.jpg'}
          height={1792}
          width={1200}
          style={{
            position: 'relative',
            width: '100%',
            height: '120%',
            // objectFit: 'cover',
            objectPosition: 'center',
          }}
          placeholder="blur"
          blurDataURL="data:image/png;base64,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"
          className="custom-auth-left-bg"
        />
        <div className="custom-auth-left-content">
          <div className="conversation">
            <Avatar
              src={'/assets/auth-character-placeholder-avatar.png'}
              height={48}
              width={48}
            />
            <div className="conversation-info">
              <p className="conversation-info-name">Aki Hamaji</p>
              <p className="conversation-info-description">
                An extremely timid and introverted first-year student in high
                school.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="custom-auth-right">
        <div className="auth-content">
          <div className={cx('get-started-label', Inter.className)}>
            {authSectionPick === AuthSection.entry && <h1> Get Started </h1>}
            {authSectionPick === AuthSection.login && <h1> Log In </h1>}
            {authSectionPick === AuthSection['sign-up'] && !isProduction && (
              <h1> Sign Up </h1>
            )}
            {authSectionPick === AuthSection['sign-up'] && isProduction && (
              <h1> Join the Waitlist </h1>
            )}
          </div>
          <form onSubmit={handleSubmit(submitAuth)}>
            <TextInput
              placeholder="name@example.com"
              className="auth-input auth-email"
              defaultValue={`${searchParams.get('email') || ''}`}
              {...register('email', {
                required: 'Email is required',
                onChange() {
                  setSuccessMessage('');
                },
              })}
            />
            {(authSectionPick === AuthSection.login ||
              // waitlist on prod for now
              (authSectionPick === AuthSection['sign-up'] &&
                !isProduction)) && (
              <TextInput
                placeholder={'Your password'}
                className="auth-input auth-password"
                type={'password'}
                {...register('password', {
                  required: 'Password is required',
                })}
              />
            )}

            {!isEmpty(errorMessage) && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}

            {!isEmpty(successMessage) && (
              <div className="success-message">
                <CheckCircledIcon height={20} width={20} />
                <p> {successMessage}</p>
              </div>
            )}

            <div className="custom-auth-choices">
              {authSectionPick === AuthSection.entry && (
                <>
                  <Button
                    onClick={pickLoginSection}
                    className="login-button"
                    ariaLabel="Navigate to log in page"
                    isLoading={authIsLoading || submitted}
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={pickSignUpSection}
                    className="signup-button"
                    ariaLabel="Navigate to sign up page"
                    isLoading={authIsLoading || submitted}
                  >
                    Sign Up
                  </Button>
                </>
              )}

              {(authSectionPick === AuthSection.login ||
                authSectionPick === AuthSection['sign-up']) && (
                <Button
                  type="submit"
                  className="submit-button"
                  ariaLabel="Submit"
                  isLoading={authIsLoading || submitted}
                >
                  Submit
                </Button>
              )}
            </div>
          </form>

          <div className="continue-with">
            <div></div>
            <p>Or Continue With</p>
            <div></div>
          </div>

          <div className="providers">
            <Button
              ariaLabel="Continue with Github"
              className="provider-button provider-github-button"
            >
              <GithubLogoIcon />
              <p>Github</p>
            </Button>
          </div>
        </div>

        <div className="custom-auth-footer">
          <div className="footer-logo">
            <BotnetIcon height={16} width={16} />
          </div>
          <div className="footer-legal">
            <Link href="/terms">Terms of Use</Link>
            <div className="footer-legal-divider"></div>
            <Link href="/privacy-policy"> Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAuth;
