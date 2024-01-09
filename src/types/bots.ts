import { IUserContext } from '.';

export interface CloneVoiceBodyRequest {
  fileUrls: string[];
  spaceBotId: string;
  name: string;
  labels: Record<string, string>;
  description?: string;
  voiceId?: string;
}

export interface CloneVoiceResponse {
  voiceId: string;
  message?: string;
}

export interface IBot {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  owner: string;
  spaceId?: string;
  formId?: string;
  greeting?: string;
  description?: string;
  voiceId?: string;
  background?: string;
}

export interface IBotKnowledge {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  size: number; // bytes
  contextEmbeddingsIds?: string[];
}

export interface IBotKnowledgeMeta {
  data: IBotKnowledge[];
}

export interface IBotFormAnswers {
  id: string;
  owner: string;
  spaceId: string;

  createdAt: string;
  deletedAt: string;
  updatedAt: string;

  instructions: string;
  name: string;
  greeting: string;
  backstory: string;
  description: string;
  meta: {
    characteristics?: string;
    facts?: Partial<IUserContext>[];
  } & Record<string, any>;
  knowledge: IBotKnowledgeMeta;
}

export interface IBotMessage {
  message: string;
  role: OpenAIRoles;
}

export enum OpenAIRoles {
  'assistant' = 'assistant',
  'user' = 'user',
  'system' = 'system',
  'function' = 'function',
}
