import cx from 'classnames';
import { useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { Auth as SupabaseAuthUI } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Inter } from '@/app/fonts';
import { useBotnetAuth } from '@/store/Auth';
import { useAppStore } from '@/store/App';
import { DialogEnums } from '@/types/dialog';
import { isFunction } from 'lodash';
import DialogCloseButton from '@/components/common/DialogCloseButton';
import './Auth.css';

/**
 * Dialog for email login and sign up
 * @returns
 */
const Auth = () => {
  const [session] = useBotnetAuth(state => [state.session]);
  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);

  /**
   * On login/signup success
   */
  useEffect(() => {
    if (session && isFunction(setShowDialog)) {
      setShowDialog(false, DialogEnums.none);
    }
  }, [session, setShowDialog]);

  return (
    <div className={cx('app-auth-dialog', Inter.className)}>
      <SupabaseAuthUI
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          extend: true,
          className: {
            anchor: Inter.className,
            button: Inter.className,
            container: Inter.className,
            message: Inter.className,
          },
        }}
        providers={[]}
      />
      <DialogCloseButton />
    </div>
  );
};

export default Auth;
