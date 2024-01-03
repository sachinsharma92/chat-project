'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { StopIcon } from '@radix-ui/react-icons';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { blobToBase64 } from '@/lib/utils';
import { Tooltip } from '@radix-ui/react-tooltip';
import { useAuth } from '@/hooks';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import './SpeechToText.css';
import { SpeechToTextApiBodyRequest } from '@/app/api/speech-to-text/route';

export type SpeechToTextComponentProps = {
  stopRecording: () => void;
  consumeText: (text: string) => void;
};

/**
 * Speech to text component built for each chat box
 * Note: when this component mounts it triggers auto recording
 * @param props
 * @returns
 */
const SpeechToText = (props: SpeechToTextComponentProps) => {
  const { stopRecording, consumeText } = props;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [time, setTime] = useState<number>(0);

  const isRecordingRef = useRef(false);

  const [recordingError, setRecordingError] = useState('');

  const chunks = useRef([]);

  const [transcribing, setTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const { userId } = useAuth();

  const handleStopClick = useCallback(async () => {
    try {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }

      stopTimer();

      if (recordingError) {
        stopRecording();
        console.log('stopRecording()');

        return;
      }
    } catch (err: any) {
      console.log('handleStopClick() err:', err?.message);
    }
  }, [recordingError, stopRecording]);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);

      if (time > 30) {
        // max 30 seconds record
        handleStopClick();
      }
    }, 1000);
  }, [time, handleStopClick]);

  const startRecording = useCallback(async () => {
    try {
      if (isRecordingRef.current) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = ev => {
        // @ts-ignore
        chunks.current.push(ev.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        try {
          setTranscribing(true);

          const audioBlob = new Blob(chunks.current, { type: 'audio/wav' });
          const b64 = await blobToBase64(audioBlob);
          const bodyProps: SpeechToTextApiBodyRequest = {
            userId,
            audio: b64 as string,
          };
          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyProps),
          }).then(res => res.json());
          const { text } = response;

          mediaRecorderRef.current?.stream
            .getTracks()
            .forEach(track => track?.stop());

          consumeText(text);
        } catch (err: any) {
          console.log('mediaRecorderRef.current.onstop err:', err?.message);
        } finally {
          setTranscribing(false);
          stopRecording();
          console.log('stopRecording()');
        }
      };

      mediaRecorderRef.current.start();
      console.log('startRecording()');

      isRecordingRef.current = true;
      startTimer();
    } catch (err: any) {
      console.log('startRecording() err:', err?.message);

      setRecordingError(err?.message || '');
      stopTimer();
    }
  }, [userId, startTimer, stopRecording, consumeText]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTime(0); // Reset time when stopping the recording
  };

  /**
   * Formats time to: MM:SS
   * @param totalSeconds
   * @returns
   */
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  /**
   * Auto start recording on mount
   */
  useEffect(() => {
    startRecording();
  }, [startRecording]);

  return (
    <TooltipProvider>
      <div className="speech-to-text">
        <div className="speech-to-text-left">
          {transcribing && <LoadingSpinner width={20} />}
        </div>
        <div className="speech-to-text-right">
          {!transcribing && (
            <p className="speech-to-text-time">{formatTime(time)}</p>
          )}

          <Tooltip>
            <TooltipTrigger
              className="speech-to-text-stop"
              onClick={() => handleStopClick()}
            >
              <StopIcon />
            </TooltipTrigger>
            <TooltipContent>
              {!recordingError && <p>Click to stop recording.</p>}
              {recordingError && <p>Device permission denied. </p>}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SpeechToText;
