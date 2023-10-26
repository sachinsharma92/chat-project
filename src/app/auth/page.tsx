import CustomAuth from '@/ui/features/CustomAuth';
import './page.css';

export enum AuthSection {
  'entry' = 'entry',
  'login' = 'login',
  'sign-up' = 'sign-up',
}

const AuthPage = () => {
  return (
    <div className="auth-page">
      <CustomAuth />
    </div>
  );
};

export default AuthPage;