export interface SupabaseResult<T> {
  data?: T;
  error?: {
    message: string;
  };
}

export interface ICloneAudioItem {
  url: string;
  name: string;
  size: number;
}

export interface ICloneAudioProps {
  data: ICloneAudioItem[];
  voiceId?: string;
  description?: string;
  name?: string;
  labels?: Record<string, string>;
}

export interface IUserPrivateProps {
  id: string;
  cloneAudio: ICloneAudioProps;
  appearance: {
    background?: string;
    backgroundUrl?: string;
  };
  owner: string;
  chatResetAt?: string;
  chatResetAtMeta?: Record<
    string,
    {
      date: string;
    }
  >;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface IBotChatMessage {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  sessionId: string;
  displayName: string;
  spaceId: string;
  role: string;
  message: string;
  authorId: string;
}
