'use client';

import { Inter } from '@/app/fonts';
import TextInput from '@/components/common/TextInput';
import cx from 'classnames';
import Button from '@/components/common/Button';
import Image from 'next/image';
import Avatar from '@/components/common/Avatar/Avatar';
import Link from 'next/link';
import './CustomAuth.css';

import { useEffect, useMemo, useState } from 'react';
import { BotnetIcon, GithubLogoIcon } from '@/icons';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { isEmpty, toString } from 'lodash';
import { AuthSection } from '@/app/auth/page';
import { supabaseClient } from '@/lib/supabase';
import { RedirectTo } from '@supabase/auth-ui-shared';
import { useBotnetAuth } from '@/store/Auth';
import { useRouterQuery } from '@/hooks';

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
  const {
    register,
    handleSubmit,
    getValues,
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
            {authSectionPick === AuthSection['sign-up'] && <h1> Sign Up </h1>}
          </div>
          <form onSubmit={handleSubmit(submitAuth)}>
            <TextInput
              placeholder="name@example.com"
              className="auth-input auth-email"
              defaultValue={`${searchParams.get('email') || ''}`}
              {...register('email', {
                required: 'Email is required',
              })}
            />
            {(authSectionPick === AuthSection.login ||
              authSectionPick === AuthSection['sign-up']) && (
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
