'use client';

import { useMemo, useState } from 'react';
import { PlayIcon, StopIcon } from '@radix-ui/react-icons';
import {
  getUserPrivateDataById,
  insertUserPrivateDataProps,
  supabaseClient,
  updateUserPrivateDataProps,
} from '@/lib/supabase';
import { publicBucketName } from '@/lib/supabase/storage';
import { useBotnetAuth } from '@/store/Auth';
import { ICloneAudioItem } from '@/types/supabase';
import { head, isNil } from 'lodash';

import Button from '@/components/common/Button';
import DialogCloseButton from '@/components/common/DialogCloseButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import { useCreatorSpace } from '@/hooks';
// import {
//   CloneVoiceBodyRequest,
//   CloneVoiceResponse,
// } from '@/app/api/clone-voice/route';
// import { APIClient } from '@/lib/api';
import { useAppStore } from '@/store/App';
import { DialogEnums } from '@/types/dialog';

import './CloneAudioUpdate.css';

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const CloneAudioUpdate = () => {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId] = useBotnetAuth(state => [state.session?.user?.id || '']);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState<any>();
  const [lastFileBlob, setLastFileBlob] = useState<Blob | null>(null);

  const { spaceInfo } = useCreatorSpace();

  // const { getSupabaseAuthHeaders } = useAuth();

  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);

  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);
  const botId = useMemo(() => spaceBotInfo?.id || '', [spaceBotInfo]);

  const startTimer = () => {
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    setTimer(intervalId);
  };

  const stopTimer = () => {
    clearInterval(timer);
    setTimer(null);
    setSeconds(0);
  };

  const startRecording = async () => {
    if (recording || uploading) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      const terminateStream = () => {
        stream.getTracks().forEach(track => {
          if (track) {
            track.stop();
          }
        });
      };
      setLastFileBlob(null);

      setRecorder(mediaRecorder);
      setRecording(true);
      startTimer();

      mediaRecorder.start();
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        setLastFileBlob(new Blob(audioChunks));
        setRecording(false);
        stopTimer();
        terminateStream();
      });

      // limit recording to 2 mins === 120 seconds
      const recordStopTimeoutId = setTimeout(() => {
        if (mediaRecorder.state !== 'inactive' || recording) {
          stopTimer();
          terminateStream();
          mediaRecorder.stop();
        }

        clearTimeout(recordStopTimeoutId);
      }, 120 * 1000); // 120 seconds
    } catch (error) {
      console.error('Error accessing the microphone', error);
    }
  };

  const stopRecording = () => {
    try {
      if (recorder && recorder?.state !== 'inactive') {
        recorder.stop();
      }

      if (recording) {
        setRecording(false);
      }

      stopTimer();
    } catch (err: any) {
      console.log('stopRecording() err:', err?.message);
    }
  };

  const discardLastFile = () => {
    if (recording) {
      return;
    }

    setUploading(false);
    setLastFileBlob(null);
    stopTimer();
  };

  /**
   * Upload last file blob and save properties
   * @param fileBlob
   * @returns
   */
  const uploadAudioFile = async (fileBlob: Blob) => {
    setUploading(true);

    try {
      const fileName = `${userId}/recorded_${Date.now()}.mp3`;
      const { data, error: uploadError } = await supabaseClient.storage
        .from(publicBucketName)
        .upload(fileName, fileBlob);
      const { data: userPrivateDataList } = await getUserPrivateDataById(
        userId,
      );
      const userPrivateData = head(userPrivateDataList);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }

      if (data?.path) {
        const { data: urlData } = supabaseClient.storage
          .from(publicBucketName)
          .getPublicUrl(data?.path);
        const publicUrl = urlData?.publicUrl;
        const cloneAudioProps: ICloneAudioItem = {
          url: publicUrl,
          name: fileName,
          size: fileBlob.size,
        };
        const props = {
          cloneAudio: { data: [cloneAudioProps] },
        };

        console.log('cloneAudioProps', cloneAudioProps);

        if (userPrivateData) {
          const { error: saveUserPrivateDataError } =
            await updateUserPrivateDataProps(userId, {
              ...props,
            });

          if (saveUserPrivateDataError) {
            throw new Error(saveUserPrivateDataError?.message);
          }
        } else {
          const { error: insertUserPrivateDataError } =
            await insertUserPrivateDataProps({ owner: userId, ...props });

          if (insertUserPrivateDataError) {
            throw new Error(insertUserPrivateDataError?.message);
          }
        }

        if (botId) {
          // @todo
          // const cloneVoiceProps: CloneVoiceBodyRequest = {
          //   fileUrl: publicUrl,
          //   spaceBotId: botId,
          // };
          // const reqHeaders = getSupabaseAuthHeaders();
          // await APIClient.post<CloneVoiceResponse>(
          //   '/api/clone-voice',
          //   cloneVoiceProps,
          //   {
          //     headers: reqHeaders,
          //   },
          // );
        }

        setShowDialog(false, DialogEnums.none);
      }
    } catch (err: any) {
      console.log('uploadAudioFile() err:', err?.message);
    } finally {
      setUploading(false);
      setLastFileBlob(null);
    }
  };

  return (
    <>
      <div className="clone-audio-update">
        <div className="clone-audio-transcript">
          <p>
            {`Once upon a time, in a tranquil meadow, there was a quick brown fox
            with a zest for adventure. Every morning, he practiced his agility
            by leaping over fallen logs and darting through the tall, whispering
            grasses. One sunny day, he encountered a lazy dog dozing near a
            babbling brook and, with a swift bound, he jumped over the dog, who
            only yawned and went back to sleep.`}
          </p>
          <br></br>
          <p>
            {`In the nearby village, the soft hum of the evening began as families
            settled down for supper, the day's work done, and the night's rest
            beckoning.`}
          </p>
        </div>
        <div className="clone-audio-instructions">
          <p>
            {`Hit "Play" button to start recording and read the transcript above.`}
          </p>
        </div>

        <div className="recorder-actions">
          <div className="recorder-timer">
            <p>{formatTime(seconds)}</p>
          </div>

          {!recording && (
            <Button onClick={startRecording} className="flex-col">
              <PlayIcon height={'24px'} width={'24px'} />
              <p className="text-xs">Play </p>
            </Button>
          )}
          {recording && (
            <Button onClick={stopRecording} className="flex-col">
              <StopIcon height={'24px'} width={'24px'} />
              <p className="text-xs">Stop </p>
            </Button>
          )}
        </div>

        {!isNil(lastFileBlob) && !uploading && (
          <div className="discard-save">
            <Button
              className="discard-button"
              variant="primary"
              onClick={discardLastFile}
            >
              Discard
            </Button>
            <Button
              className="save-button"
              variant="primary"
              onClick={() => {
                uploadAudioFile(lastFileBlob);
              }}
            >
              Save
            </Button>
          </div>
        )}

        {uploading && (
          <div className="uploading-spinner">
            <LoadingSpinner width={30} />
            <p>Saving..</p>
          </div>
        )}
      </div>
      {!uploading && !recording && <DialogCloseButton />}
    </>
  );
};

export default CloneAudioUpdate;
