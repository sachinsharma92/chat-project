import { useEffect, useMemo, useRef, useState } from 'react';
import { IUserPrivateProps } from '@/types/supabase';
import { getUserPrivateDataById } from '@/lib/supabase';
import { useBotnetAuth } from '@/store/Auth';
import { useAppStore } from '@/store/App';
import { DialogEnums } from '@/types/dialog';
import { head, isEmpty } from 'lodash';

import Button from '@/components/common/Button';
import './CloneAudio.css';
import AudioPlayer from './AudioPlayer';

const CloneAudio = () => {
  const [userPrivateData, setUserPrivateData] = useState<
    IUserPrivateProps | undefined
  >(undefined);
  const [showDialogType, setShowDialog] = useAppStore(state => [
    state.showDialogType,
    state.setShowDialog,
  ]);
  const fetchingPrivateData = useRef(false);
  const [userId] = useBotnetAuth(state => [state.session?.user?.id]);

  /**
   * Init fetch user private data
   */
  useEffect(() => {
    const fetchLatestUserdata = async () => {
      if (!userId || fetchingPrivateData?.current) {
        return;
      }

      fetchingPrivateData.current = true;

      const { data, error } = await getUserPrivateDataById(userId);

      if (!error && !isEmpty(data)) {
        setUserPrivateData(head(data));
      }

      fetchingPrivateData.current = false;
    };

    fetchLatestUserdata();
  }, [userId, showDialogType]);

  const unsupported = useMemo(
    () =>
      typeof navigator.mediaDevices === 'undefined' ||
      typeof MediaRecorder === 'undefined',
    [],
  );
  const audioFilename = useMemo(
    () => head(userPrivateData?.cloneAudio?.data)?.name,
    [userPrivateData],
  );

  const audioSrc = useMemo(
    () => head(userPrivateData?.cloneAudio?.data)?.url || '',
    [userPrivateData],
  );

  const showUpdateDialog = () => {
    if (unsupported) {
      return;
    }

    setShowDialog(true, DialogEnums.cloneAudioUpdate);
  };

  return (
    <div className="clone-audio">
      {unsupported && (
        <div className="device-unsupported">
          <p>Device Unsupported</p>
        </div>
      )}
      <div className="file-input-container">
        <p className="file-path">{audioFilename || 'No audio file'} </p>
        <Button onClick={showUpdateDialog} className="file-update">
          Update audio
        </Button>
      </div>
      {audioSrc && <AudioPlayer audioSrc={audioSrc} />}
    </div>
  );
};

export default CloneAudio;
