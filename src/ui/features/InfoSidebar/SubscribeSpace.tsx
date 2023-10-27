import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import * as EmailValidator from 'email-validator';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { subscribeEmailToSpace } from '@/lib/supabase';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useState } from 'react';

import './SubscribeSpace.css';

/**
 * Subscribe to space input
 * @returns
 */
const SubscribeSpace = () => {
  const { register, handleSubmit, setValue } = useForm();

  const { toast } = useToast();

  const { spaceId } = useSelectedSpace();

  const [submitted, setSubmitted] = useState(false);
  /**
   * Submit store email
   * @param data
   */
  const submitSubscribe = async (data: any) => {
    try {
      const { email } = data;

      if (!EmailValidator.validate(email)) {
        toast({
          variant: 'destructive',
          title: 'Invalid email address.',
          duration: 1_500,
        });

        return;
      }

      setSubmitted(true);
      // success send
      setValue('email', '');
      await subscribeEmailToSpace(email, spaceId);
    } catch (err: any) {
      console.log('submitSubscribe() err:', err?.message);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="subscribe-space">
      <form onSubmit={handleSubmit(submitSubscribe)}>
        <TextInput
          placeholder="Type your email here"
          className="subscribe-space-input"
          {...register('email', { required: 'Email is required.' })}
        />
        <Button
          type="submit"
          className="subscribe-space-submit"
          isLoading={submitted}
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default SubscribeSpace;
