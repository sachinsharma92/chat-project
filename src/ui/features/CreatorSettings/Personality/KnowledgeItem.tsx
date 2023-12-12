'use client';

import { IBotKnowledge } from '@/types';
import { isEmpty, isFunction, size, toString } from 'lodash';
import { useState } from 'react';
import { CrossIcon } from '@/icons';
import {
  deleteUserContext,
  deleteUserContextEmbedding,
} from '@/lib/supabase/embeddings';

import Button from '@/components/common/Button';
import './KnowledgeItem.css';

const KnowledgeItem = (props: {
  removeKnowledge: (id: string) => Promise<void>;
  knowledgeItem: IBotKnowledge;
}) => {
  const [removing, setRemoving] = useState(false);
  const { knowledgeItem, removeKnowledge } = props;

  const onRemove = async () => {
    if (removing) {
      return;
    }

    setRemoving(true);

    if (knowledgeItem?.id && isFunction(removeKnowledge)) {
      await removeKnowledge(knowledgeItem.id);
    }

    if (
      knowledgeItem?.contextEmbeddingsIds &&
      !isEmpty(knowledgeItem?.contextEmbeddingsIds)
    ) {
      console.log('deleting contextEmbeddingsIds');
      for (let i = 0; i < size(knowledgeItem.contextEmbeddingsIds); i++) {
        const contextEmbeddingsId = knowledgeItem.contextEmbeddingsIds[i];

        if (contextEmbeddingsId) {
          await deleteUserContextEmbedding(contextEmbeddingsId);
          await deleteUserContext(contextEmbeddingsId);
        }
      }
    }

    setRemoving(false);
  };

  console.log('knowledgeItem', knowledgeItem);

  return (
    <div className="knowledge-item">
      <p>{toString(knowledgeItem?.fileName)}</p>

      <Button
        className="relative flex justify-center items-center box-border h-[30px] w-[30px]"
        isLoading={removing}
      >
        <CrossIcon height={'12px'} width={'12px'} onClick={onRemove} />
      </Button>
    </div>
  );
};

export default KnowledgeItem;
