'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '.';
import {
  getUserPrivateDataById,
  insertUserPrivateDataProps,
} from '@/lib/supabase';
import { head } from 'lodash';
import { IUserPrivateProps } from '@/types/supabase';

import camelcaseKeys from 'camelcase-keys';

export const useUserPrivateData = () => {
  const { userId } = useAuth();
  const memoedUserId = useMemo(() => userId, [userId]);

  const [userPrivateData, setUserPrivateData] =
    useState<IUserPrivateProps | null>(null);
  /**
   * Fetch latest user private data
   */
  useEffect(() => {
    const fetchUserPrivateData = async () => {
      if (!memoedUserId) {
        return;
      }

      console.log('fetchUserPrivateData()');
      const res = await getUserPrivateDataById(memoedUserId);
      const targetUserPrivateData = head(res?.data);

      if (targetUserPrivateData) {
        setUserPrivateData(
          camelcaseKeys(
            targetUserPrivateData as Record<string, any>,
          ) as IUserPrivateProps,
        );
      } else if (memoedUserId) {
        // insert new
        const newProps = {
          owner: memoedUserId,
          cloneAudio: { data: [] },
          appearance: {},
        };

        const { error: insertUserPrivateDataError } =
          await insertUserPrivateDataProps(newProps);

        if (!insertUserPrivateDataError?.message) {
          setUserPrivateData(
            camelcaseKeys(newProps as Record<string, any>) as IUserPrivateProps,
          );
        }
      }
    };

    fetchUserPrivateData();
  }, [memoedUserId]);

  return {
    userPrivateData,
    setUserPrivateData,
  };
};
