import CustomAuth from '@/ui/features/CustomAuth';
import './page.css';
import { AuthSection } from '../auth/page';

const LoginPage = () => {
  return (
    <div className="login-page">
      <CustomAuth defaultSection={AuthSection.login} />
    </div>
  );
};

export default LoginPage;
