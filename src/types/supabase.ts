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

export interface IUserPrivateProps {
  id: string;
  cloneAudio: {
    data: ICloneAudioItem[];
    description?: string;
    name?: string;
    labels?: Record<string, string>;
  };
  appearance: {
    background?: string;
    backgroundUrl?: string;
  };
  owner: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
