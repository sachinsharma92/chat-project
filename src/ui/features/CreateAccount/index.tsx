import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import Link from 'next/link';

import { FC } from 'react';
import './SpaceDescription.css';

interface CreateAccountProps {
  closeHandler?: () => void;
}


const CreateAccount: FC<CreateAccountProps> = ({ closeHandler }) => {
  return (
    <div className='create-account bg-black p-4 w-full mt-4'>
      <div className='flex justify-between'>
        <h4 className="text-xs uppercase text-white">Create Account</h4>
        <Button className="text-xs text-white p-0" onClick={closeHandler}>
          Close
        </Button>
      </div>

      <form action="" className="flex flex-col gap-1 mt-4">
        <TextInput
          className="text-input"
          placeholder="Email"
        />
        <TextInput
          className="text-input"
          placeholder="Username"
        />
        <TextInput
          className="text-input"
          placeholder="password"
        />

        <Button className="text-input mt-3 text-sm">
          Create Account
        </Button>

        <Button className="text-white p-0 h-[36px] underline text-sm">
          Login
        </Button>
      </form>

      <div className='flex justify-center items-center'>
        <p className="text-white text-xs">By proceeding, you agree to the <Link href="/" className="underline">Privacy Policy</Link> & <Link href="/" className="underline">Terms of Service</Link></p>
      </div>
    </div>
  );
};

export default CreateAccount;
