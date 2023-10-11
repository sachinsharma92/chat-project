export interface IBot {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  owner: string;
  spaceId?: string;
  formId?: string;
}

export interface IBotFormAnswers {
  id: string;
  owner: string;
  spaceId: string;

  createdAt: string;
  deletedAt: string;
  updatedAt: string;

  name: string;
  greeting: string;
  backstory: string;
  description: string;
  meta: Record<string, any>;
}

export enum OpenAIRoles {
  'assistant' = 'assistant',
  'user' = 'user',
  'system' = 'system',
  'function' = 'function',
}
