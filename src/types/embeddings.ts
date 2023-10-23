export interface IUserContext {
  id: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  context?: string;
  owner?: string;
  botId?: string;
}

export interface IUserContextEmbedding extends IUserContext {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  context?: string;
  owner?: string;
  botId?: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}

export type IUserContextType =
  | 'clone.facts'
  | 'clone.question'
  | 'clone.answer'
  | 'clone.qa'; // q&a
