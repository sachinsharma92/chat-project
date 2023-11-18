import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import {
  SpeechConfig,
  SpeechSynthesizer,
  SpeechSynthesisVisemeEventArgs,
} from 'microsoft-cognitiveservices-speech-sdk';

import axios from 'axios';
import { Readable } from 'stream';
import { head, last, toString, trim } from 'lodash';
import { applyApiRoutesAuth } from '../bot-chat/route';
import {
  getElevenLabsTextToSpeechApiBaseUrl,
  getElevenLabsApiKey,
} from '@/lib/elevenlabs';
import { returnCommonStatusError } from '@/lib/utils/routes';
import { getSpaceBotById, supabaseClient } from '@/lib/supabase';
import {
  publicBucketName,
  publicFolderForBotAudio,
} from '@/lib/supabase/storage';
import { v4 as uuid } from 'uuid';
import { isDevelopment } from '@/lib/environment';
import camelcaseKeys from 'camelcase-keys';
import { IBot } from '@/types';

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
  const { message, userId, spaceId, spaceBotId }: BotAudioBodyRequest =
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

  try {
    if (!validAuth) {
      // @todo limit messages
    }

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
          similarity_boost: 0.5,
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

    const fileName = `${uuid()}-${userId}.mp3`;
    const filePath = `${publicFolderForBotAudio}/${fileName}`;
    const readableInstanceStream = new Readable({
      read() {
        this.push(res.data);
        this.push(null); // End the stream
      },
    });

    if (isDevelopment) {
      console.log('fileName', fileName, 'filePath', filePath);
    }

    const { data, error } = await supabaseClient.storage
      .from(publicBucketName)
      .upload(filePath, readableInstanceStream, {
        duplex: 'half',
        contentType: 'audio/mpeg', // MIME type of mp3
        upsert: true, // If you want to overwrite existing files with the same name
      });

    if (error?.message) {
      throw new Error(error?.message);
    }

    if (isDevelopment) {
      console.log('data path', data?.path);
    }

    if (data?.path) {
      const { data: urlData } = supabaseClient.storage
        .from(publicBucketName)
        .getPublicUrl(data?.path);
      const publicUrl = urlData?.publicUrl;

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

      return NextResponse.json(
        {
          publicUrl,
          visemes: visemeData,
        },
        {
          status: 200,
        },
      );
    } else {
      // @ts-ignore
      throw new Error(error);
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('/api/bot-audio err:', error?.message);
    }

    return returnCommonStatusError(error?.message || '');
  }
}
