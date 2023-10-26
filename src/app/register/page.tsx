import CustomAuth from '@/ui/features/CustomAuth';
import './page.css';
import { AuthSection } from '../auth/page';

const SignUpPage = () => {
  return (
    <div className="signup-page">
      <CustomAuth defaultSection={AuthSection['sign-up']} />
    </div>
  );
};

export default SignUpPage;
