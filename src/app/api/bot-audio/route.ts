import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import {
  SpeechConfig,
  SpeechSynthesizer,
  SpeechSynthesisVisemeEventArgs,
} from 'microsoft-cognitiveservices-speech-sdk';
import { Readable } from 'stream';
import { head, last, toString, trim } from 'lodash';
import { applyApiRoutesAuth } from '../bot-chat/route';
import {
  getElevenLabsTextToSpeechApiBaseUrl,
  getElevenLabsApiKey,
} from '@/lib/elevenlabs';
import {
  returnApiUnauthorizedError,
  returnCommonStatusError,
} from '@/lib/utils/routes';
import { getSpaceBotById } from '@/lib/supabase';
import { isDevelopment } from '@/lib/environment';
import { IBot } from '@/types';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

export interface BotAudioBodyRequest {
  message: string;
  userId: string;
  spaceId?: string;
  spaceBotId?: string;
}

export interface BotAudioResponse {
  publicUrl: string;
  visemes: any[];
}

export async function POST(request: Request) {
  const headers = request.headers;
  const authorization = headers.get('Authorization');
  const refreshToken = headers.get('X-RefreshToken') as string;
  const accessToken = last(toString(authorization).split('BEARER ')) as string;
  const { message, spaceId, spaceBotId }: BotAudioBodyRequest =
    await request.json();
  const defaultVoiceId = 'IKne3meq5aSn9XLyUdCD';
  const authRes = await applyApiRoutesAuth(accessToken, refreshToken);
  const validAuth = authRes && !authRes?.error && accessToken && refreshToken; // @todo send sentry error if validAuth === false

  let voiceId: string = defaultVoiceId;

  if (spaceId === '554eb516-1a29-4739-b748-d239248607d3') {
    // apparently, /api/clone-voice don't work yet
    // there's problem with sending FormData() from nodejs env
    // approach me @robert when you have a solution
    voiceId = 'g6pr0Z1BRlXIYjtpHFR6';
  } else if (spaceId === '5b1e8603-144c-4b13-842a-ada5533ea43c') {
    voiceId = 'EaxEsbwameBaIZWcBKy0';
  } else if (spaceBotId) {
    // grab voice id from record
    const { data, error } = await getSpaceBotById(spaceBotId);
    const spaceBotInfo = camelcaseKeys(
      head(data) as Record<string, any>,
    ) as IBot;

    if (!error && spaceBotInfo?.voiceId) {
      voiceId = spaceBotInfo?.voiceId;
    }
  }

  if (!validAuth) {
    return returnApiUnauthorizedError();
  }

  try {
    const elevenlabsUrl = `${
      getElevenLabsTextToSpeechApiBaseUrl() + voiceId
    }?optimize_streaming_latency=0&output_format=mp3_44100_128`;

    if (isDevelopment) {
      console.log('elevenlabsUrl', elevenlabsUrl);
    }

    const model_id = 'eleven_turbo_v2';
    const res = await axios.post(
      elevenlabsUrl,
      {
        text: trim(message),
        model_id: model_id,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 1,
        },
      },
      {
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': getElevenLabsApiKey(),
        },
        responseType: 'arraybuffer',
      },
    );

    const speechConfig = SpeechConfig.fromSubscription(
      process.env.MICROSOFT_COGNITIVESERVICES_SPEECH || '',
      process.env.MICROSOFT_COGNITIVESERVICES_SPEECH_REGION || '',
    );
    const synthesizer = new SpeechSynthesizer(speechConfig);

    let visemeData: any[] = [];

    // Subscribe to the viseme received event
    // @ts-ignore
    synthesizer.visemeReceived = (s, e: SpeechSynthesisVisemeEventArgs) => {
      visemeData.push({
        VisemeId: e.visemeId,
        AudioOffset: e.audioOffset,
      });
    };

    // Convert text to speech and wait for completion
    try {
      await new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(
          message,
          result => {
            if (result) {
              synthesizer.close();
              resolve(result);
            }
          },
          error => {
            synthesizer.close();
            reject(error);
          },
        );
      });
    } catch (error: any) {
      console.log('synthesizer.speakTextAsync() err:', error?.message);
    }

    const readableInstanceStream = new Readable({
      read() {
        this.push(res.data);
        this.push(null); // End the stream
      },
    });

    // @ts-ignore
    const response = new Response(readableInstanceStream);

    response.headers.set('X-visemes-data', JSON.stringify({ visemeData }));
    response.headers.set('Content-Type', 'audio/mpeg');
    return response;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('/api/bot-audio err:', error?.message);
    }

    return returnCommonStatusError(error?.message || '');
  }
}
