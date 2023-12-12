import { IBotFormAnswers } from '@/types';
import { useEffect, useState } from 'react';
import { useAuth, useCreatorSpace } from '.';
import {
  createSpaceBotProfile,
  getAICloneCompletedForms,
  updateOrCreateAICloneFormProperties,
} from '@/lib/supabase';
import { head } from 'lodash';

import camelcaseKeys from 'camelcase-keys';
import { v4 } from 'uuid';

/**
 * Reusable hook for getting latest creator space bot form data
 * @returns
 */
export const useSpaceBotForm = () => {
  const { userId } = useAuth();

  const [botFormAnswers, setBotFormAnswers] =
    useState<Partial<IBotFormAnswers> | null>(null);

  const [fetchingFormData, setFetchingFormData] = useState(true);

  const { spaceId } = useCreatorSpace();

  /**
   * Fetch most recently accomplished bot forms, i.e. AI clones
   */
  useEffect(() => {
    const get = async () => {
      if (userId && spaceId) {
        console.log('useSpaceBotForm getAICloneCompletedForms()');

        const { data, error } = await getAICloneCompletedForms(spaceId);

        if (data && !error) {
          // we only pick the first bot data-
          // since we only support 1 space == 1 bot for now
          setBotFormAnswers(
            camelcaseKeys(head(data) as Record<string, any>) as IBotFormAnswers,
          );
          setFetchingFormData(false);
        } else if (!error) {
          // insert new
          const cloneFormProps = {
            spaceId,
            owner: userId,
            updatedAt: new Date().toISOString(),
            name: '',
          };
          const resUpdateOrCreate = await updateOrCreateAICloneFormProperties(
            cloneFormProps,
            '',
          );

          if (resUpdateOrCreate?.id) {
            const newSpaceBotProps = {
              spaceId,
              formId: resUpdateOrCreate?.id,
              description: '',
              id: v4(),
              owner: userId,
            };
            await createSpaceBotProfile(newSpaceBotProps);

            setBotFormAnswers({ ...cloneFormProps, id: resUpdateOrCreate.id });
          }
        }
      }
    };

    get();
  }, [userId, spaceId]);

  return {
    fetchingFormData,
    setBotFormAnswers,
    setFetchingFormData,
    botFormAnswers,
  };
};
