import { filter, head, isEmpty, map, size, omit } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { getUserContextListByPage } from '@/lib/supabase/embeddings';
import { IUserContext } from '@/types';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import CloneAIFact from './CloneAIFact';
import { useAuth } from '@/hooks';
import {
  GenerateEmbeddingsBodyRequest,
  GenerateEmbeddingsResponse,
} from '@/app/api/generate-embeddings/route';
import { isResponseStatusSuccess } from '@/lib/utils';

import { APIClient } from '@/lib/api';
import { useSpacesStore } from '@/store/App';

import './CloneAIFacts.css';

/**
 * Component that accepts facts about the character to clone
 * @returns
 */
const CloneAIFacts = () => {
  const [spaces] = useSpacesStore(state => [state.spaces]);

  const { getSupabaseAuthHeaders, userId } = useAuth();

  // owned space, not necessarily active/selected
  const spaceInfo = useMemo(() => {
    const find = filter(
      spaces,
      space => !isEmpty(space?.id) && space?.owner === userId,
    );
    return head(find);
  }, [spaces, userId]);
  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);
  const botId = useMemo(() => spaceBotInfo?.id || '', [spaceBotInfo]);
  const [facts, setFacts] = useState<IUserContext[]>([]);

  /**
   * Fetch facts
   * First page
   * Limit fact items to 'userContextItemsLimit' value === 5
   */
  useEffect(() => {
    const getList = async () => {
      if (botId) {
        const { data, error } = await getUserContextListByPage(
          // limited to 5 facts for now
          1,
          botId,
          'clone.facts',
        );

        if (!error && data) {
          setFacts(data);
        }
      }
    };

    getList();
  }, [botId]);

  const { register, watch, handleSubmit, setValue } = useForm();

  const [isCreating, setIsCreating] = useState(false);

  const maxFactsLimitReached = useMemo(() => size(facts) >= 5, [facts]);

  /**
   * Record new context about the character and generate embeddings
   * @param data
   * @returns
   */
  const createContext = async (data: any) => {
    const { context } = data;

    if (size(context) < 2 || isCreating) {
      return;
    }

    try {
      setIsCreating(true);
      const dataBody: GenerateEmbeddingsBodyRequest = {
        userId,
        botId,
        context,
        type: 'clone.facts',
      };
      const authHeaders = getSupabaseAuthHeaders();
      const res = await APIClient.post<GenerateEmbeddingsResponse>(
        '/api/generate-embeddings',
        dataBody,
        {
          headers: {
            ...authHeaders,
          },
        },
      );
      const resData = res?.data;

      if (
        isResponseStatusSuccess(res) &&
        resData?.success &&
        resData?.payload &&
        !isEmpty(resData?.payload)
      ) {
        setFacts([resData?.payload, ...facts]);
        setValue('context', '');
      }
    } catch (err: any) {
      console.log('createContext() err:', err?.message);
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Remove fact by id from local state
   * @param id
   */
  const onRemoveFact = (id: string) => {
    if (id) {
      setFacts(filter(facts, f => f?.id !== id));
    }
  };

  /**
   * Update fact item by id from local state
   * @param id
   * @param props
   */
  const onUpdateFact = (id: string, props: Partial<IUserContext>) => {
    setFacts(
      map(facts, f => {
        if (f?.id === id) {
          return {
            ...f,
            ...omit(props, ['id', 'createdAt']),
          };
        }

        return f;
      }),
    );
  };

  return (
    <div className="clone-facts">
      <label className="clone-facts-label" htmlFor="description">
        Character Facts:
      </label>

      <form
        onSubmit={handleSubmit(createContext)}
        className={`create-new${maxFactsLimitReached ? ' hidden' : ''}`}
      >
        <TextInput
          variant="primary"
          placeholder="I like anime!"
          {...register('context', {
            required: false,
          })}
        />
        <div className="create-new-actions">
          <Button
            variant={'primary'}
            className="create-new-button"
            type="submit"
            isLoading={isCreating}
            isDisabled={size(watch('context')) < 2}
          >
            Create
          </Button>
        </div>
      </form>

      <ul>
        {map(facts, f => {
          const key = `cloneAIFact${f.id}`;

          return (
            <li key={key}>
              <CloneAIFact
                removeFact={onRemoveFact}
                updateFact={onUpdateFact}
                id={f.id}
                context={f.context || ''}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CloneAIFacts;
