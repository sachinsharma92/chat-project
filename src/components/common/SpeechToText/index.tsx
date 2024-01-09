'use client';

import { SpeechToTextApiBodyRequest } from '@/app/api/speech-to-text/route';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks';
import { blobToBase64 } from '@/lib/utils';
import { Tooltip } from '@radix-ui/react-tooltip';
import { useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";

import LoadingSpinner from '@/components/common/LoadingSpinner';

import { StopIcon } from '@/icons';
import './SpeechToText.css';

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
  let wavesurfer, record;

  const timerRef = useRef<NodeJS.Timeout | number | null>(null);

  const isRecordingRef = useRef(false);

  const [recordingError, setRecordingError] = useState('');

  const chunks = useRef([]);

  const [transcribing, setTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const { userId } = useAuth();

  const handleStopClick = useCallback(async () => {
    try {
      if (transcribing) {
        return;
      }

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }

      if (recordingError) {
        stopRecording();
        console.log('stopRecording()');

        return;
      }
    } catch (err: any) {
      console.log('handleStopClick() err:', err?.message);
    }
  }, [transcribing, recordingError, stopRecording]);

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
      mediaRecorderRef.current.onstart = (e) => {
        console.log(e, 'check e');
      }
      // const recordedUrl = URL.createObjectURL(stream)
      // console.log(recordedUrl, 'check recordedUrl');
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

    } catch (err: any) {
      console.log('startRecording() err:', err?.message);

      setRecordingError(err?.message || '');
    }
  }, [userId, stopRecording, consumeText]);

  /**
   * Auto start recording on mount
   */
  useEffect(() => {
    startRecording();
  }, [startRecording]);

  /**
   * Clean up stream tracks
   */
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current?.stream
          .getTracks()
          .forEach(track => track?.stop());
      }

      clearInterval(timerRef.current as number);
    };
  }, []);


  const createWaveSurfer = () => {
    if (wavesurfer) { wavesurfer.destroy() }

    wavesurfer = WaveSurfer.create({
      container: "#wave",
      waveColor: "white",
      progressColor: "green",
      barWidth: 2,
      barGap: 5,
      barRadius: 20,
      height: 20,
      audioRate: 10
    });

    record = wavesurfer.registerPlugin(
      RecordPlugin.create({ scrollingWaveform: true })
    );
    // setRecord(recordTest)
  };

  useEffect(() => {
    createWaveSurfer();
    if (record) {
      record.startRecording()
    }
  }, [record]);


  return (
    <TooltipProvider>
      <div className="speech-to-text">
        <div className="speech-to-text-left">
          {transcribing && <LoadingSpinner width={20} />}
          {!transcribing && <div id='wave' className="h-[34px] absolute w-full top-0 left-0 z-50 bg-black pt-[7px]" />}

          {/* {!transcribing && (
            <p className="speech-to-text-time">{formatTime(time)}</p>
          )} */}
        </div>
        <div className="speech-to-text-right">
          <Tooltip>
            <TooltipTrigger
              className="chat-btn"
              onClick={() => handleStopClick()}
              disabled={transcribing}
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
