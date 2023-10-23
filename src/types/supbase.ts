export interface SupabaseResult<T> {
  data?: T;
  error?: {
    message: string;
  };
}
