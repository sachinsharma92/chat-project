import { useBotnetAuth } from '@/store/Auth';
import { useMemo } from 'react';

/**
 * Use supabase auth token format for other requests
 */
const useAuth = () => {
  const [session] = useBotnetAuth(state => [state.session]);

  /**
   * Get auth headers
   * @returns
   */
  const getSupabaseAuthHeaders = () => {
    return {
      Authorization: `BEARER ${session?.access_token}`,
      'X-RefreshToken': `${session?.refresh_token}`,
    };
  };
  const userId = useMemo(() => session?.user?.id || '', [session]);

  return {
    userId,
    getSupabaseAuthHeaders,
  };
};

export default useAuth;
