'use client';

import { IBotFormAnswers, IBotKnowledge } from '@/types';
import { useMemo, useState } from 'react';
import { filter, head, isEmpty, map } from 'lodash';
import { uploadAIKnowledgeFile } from '@/lib/utils/upload';
import { v4 } from 'uuid';
import { useAuth, useCreatorSpace } from '@/hooks';
import {
  GenerateEmbeddingsBodyRequest,
  GenerateEmbeddingsResponse,
} from '@/app/api/generate-embeddings/route';
import { APIClient } from '@/lib/api';

import camelcaseKeys from 'camelcase-keys';
import Button from '@/components/common/Button';
import KnowledgeItem from './KnowledgeItem';
import './Knowledge.css';

const Knowledge = (props: {
  botFormAnswers: Partial<IBotFormAnswers> | null;
  updatePersonalityProps: (
    updatedProps: Partial<IBotFormAnswers>,
  ) => Promise<void>;
}) => {
  const { botFormAnswers, updatePersonalityProps } = props;
  const knowledge = useMemo(
    () =>
      map(
        filter(botFormAnswers?.knowledge?.data, ki => !isEmpty(ki?.id)),
        ki => camelcaseKeys(ki as Record<string, any>),
      ) as IBotKnowledge[],
    [botFormAnswers?.knowledge],
  );

  const [uploading, setUploading] = useState(false);

  const { userId, getSupabaseAuthHeaders } = useAuth();

  const [updating, setUpdating] = useState(false);

  const { spaceInfo } = useCreatorSpace();
  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);
  const botId = useMemo(() => spaceBotInfo?.id, [spaceBotInfo]);

  const onAddKnowledge = async () => {
    try {
      setUpdating(true);
      // trigger upload file
      const res = await uploadAIKnowledgeFile(
        userId,
        () => setUploading(true),
        () => setUploading(false),
      );

      if (res?.url && !isEmpty(res?.url)) {
        const newKnowledge: IBotKnowledge = {
          id: v4(),
          url: res?.url,
          fileName: res?.fileName,
          fileType: res?.fileType,
          size: res?.size,
          contextEmbeddingsIds: [], // @todo
        };
        const dataBody: GenerateEmbeddingsBodyRequest = {
          userId,
          botId,
          fileUrl: res.url,
          useContextId: '',
          type: 'clone.knowledge',
        };
        const authHeaders = getSupabaseAuthHeaders();
        const generateRes = await APIClient.post<GenerateEmbeddingsResponse>(
          '/api/generate-embeddings',
          dataBody,
          {
            headers: {
              ...authHeaders,
            },
          },
        );
        const resData = generateRes?.data;
        const contextEmbeddingsIds = resData?.contextEmbeddingsIds || [];
        const updatedKnowledge = {
          data: [...knowledge, { ...newKnowledge, contextEmbeddingsIds }],
        };

        await updatePersonalityProps({ knowledge: updatedKnowledge });
      }
    } catch (err: any) {
      console.log('onAddKnowledge() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const removeKnowledge = async (id: string) => {
    try {
      if (updating) {
        return;
      }

      setUpdating(true);

      await updatePersonalityProps({
        knowledge: {
          data: filter(knowledge, ki => !isEmpty(ki?.id) && ki?.id !== id),
        },
      });
    } catch (err: any) {
      console.log('removeKnowledge() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="personality-knowledge">
      {!isEmpty(knowledge) && (
        <ul>
          {map(knowledge, ki => {
            const key = `${ki?.id}`;

            return (
              <li key={key}>
                <KnowledgeItem
                  removeKnowledge={removeKnowledge}
                  knowledgeItem={ki}
                />
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex justify-start items-center box-border w-full mt-6 mb-4">
        <Button
          className="add-knowledge-button bg-[#f5f5f5]"
          onClick={onAddKnowledge}
          isLoading={uploading || updating}
        >
          <p>Add Knowledge</p>
        </Button>
      </div>
    </div>
  );
};

export default Knowledge;
