import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import axios from 'axios';
import { ReactNode, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TrashIcon } from '@radix-ui/react-icons';
import { deleteUserContextEmbedding } from '@/lib/supabase/embeddings';
import { head, isFunction } from 'lodash';
import { useAuth } from '@/hooks';
import { GenerateEmbeddingsBodyRequest } from '@/app/api/generate-embeddings/route';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { isResponseStatusSuccess } from '@/lib/utils';
import { IUserContext } from '@/types';

import './CloneAIFact.css';

/**
 * Character fact item component
 * @param props
 * @returns
 */
const CloneAIFact = (props: {
  children?: ReactNode;
  context: string;
  id: string;
  removeFact?: (id: string) => void;
  updateFact?: (id: string, props: Partial<IUserContext>) => void;
}) => {
  const { context, id } = props;
  const { register, handleSubmit, setValue, watch } = useForm();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { userId, getSupabaseAuthHeaders } = useAuth();

  const { spaceInfo } = useSelectedSpace();
  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);
  const botId = useMemo(() => spaceBotInfo?.id, [spaceBotInfo]);

  /**
   * Update context of character and its embedding values
   * @param data
   */
  const updateContext = async (data: any) => {
    const { context: updatedContext } = data;

    try {
      if (
        updating ||
        deleting ||
        !updatedContext ||
        context === updatedContext
      ) {
        return;
      }

      setUpdating(true);

      const dataBody: GenerateEmbeddingsBodyRequest = {
        userId,
        botId,
        context: updatedContext,
        useContextId: id,
        type: 'clone.facts',
      };
      const authHeaders = getSupabaseAuthHeaders();
      const res = await axios({
        method: 'POST',
        baseURL: '/',
        url: '/api/generate-embeddings',
        headers: {
          ...authHeaders,
        },
        data: dataBody,
      });
      const resData = res?.data;

      if (isResponseStatusSuccess(res) && resData?.success) {
        setValue('context', updatedContext);

        if (isFunction(props?.updateFact)) {
          props.updateFact(id, { context: updatedContext });
        }
      }
    } catch (err: any) {
      console.log('updateContext() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const showSaveButton = watch('context') && watch('context') !== context;

  /**
   * On discard, revert to original value
   */
  const onDiscard = () => {
    setValue('context', context);
  };

  /**
   * Remove context
   */
  const onDelete = async () => {
    if (deleting || updating) {
      return;
    }

    setDeleting(true);
    const response = await deleteUserContextEmbedding(id);
    const error = response?.error;

    if (!error && isFunction(props?.removeFact)) {
      props.removeFact(id);
    } else {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(updateContext)} className="clone-ai-fact">
      <div className="clone-ai-fact-input-container">
        <TextInput
          variant={'primary'}
          {...register('context', {
            required: false,
            value: context,
          })}
        />
        <Button
          isLoading={deleting}
          onClick={onDelete}
          className="clone-ai-fact-delete"
        >
          <TrashIcon height={'20px'} width={'20px'} />
        </Button>
      </div>

      {showSaveButton && (
        <div className="clone-ai-fact-actions">
          {!updating && (
            <Button
              onClick={onDiscard}
              variant="primary"
              className="clone-ai-fact-actions-discard"
            >
              Discard
            </Button>
          )}
          <Button
            isLoading={updating}
            type="submit"
            variant="primary"
            className="clone-ai-fact-actions-save"
          >
            Save
          </Button>
        </div>
      )}
    </form>
  );
};

export default CloneAIFact;
