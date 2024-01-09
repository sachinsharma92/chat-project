import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import Link from 'next/link';

import { FC } from 'react';
import './LoginAccount.css';

interface CreateAccountProps {
  closeHandler?: () => void;
  createHandler?: any;
}

const LoginAccount: FC<CreateAccountProps> = ({ closeHandler, createHandler }) => {
  return (
    <div className='login-account bg-white dark:bg-black p-4 w-full'>
      <div className='flex justify-between'>
        <h4 className="text-xs uppercase text-black dark:text-white font-medium">Login</h4>
        <Button className="text-xs text-black dark:text-white p-0" onClick={closeHandler}>
          Close
        </Button>
      </div>

      <form action="" className="flex flex-col gap-1 mt-4">
        <TextInput
          className="text-input"
          placeholder="Email or Username"
        />
        <TextInput
          className="text-input"
          placeholder="password"
          type="password"
        />

        <Button className="create-account-btn">
          Login
        </Button>

        <Button onClick={createHandler} className="text-black dark:text-white p-0 h-[36px] underline text-xs">
          Create Account
        </Button>
      </form>

      <div className="h-[0.5px] bg-[#D9D9D9] mt-3 mb-4" />

      <div className='flex justify-center items-center'>
        <p className="text-black dark:text-white text-xs font-light">By proceeding, you agree to the <Link href="/" className="underline font-light hover:opacity-70 hover:text-black/75">Privacy Policy</Link> & <Link href="/" className="underline font-light hover:opacity-70 hover:text-black/75">Terms of Service</Link></p>
      </div>
    </div>
  );
};

export default LoginAccount;
