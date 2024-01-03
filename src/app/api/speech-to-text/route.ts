import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import { toFile } from 'openai/uploads';
import { returnCommonStatusError } from '@/lib/utils/routes';
import { getOpenAI } from '@/lib/openai';
import { NextResponse } from 'next/server';

export interface SpeechToTextApiBodyRequest {
  audio: string;
  userId: string;
}

/**
 * POST request handler for transcribing user audio using open AI's whisper
 * Returns transcribed text value
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const base64Audio = body.audio;
    const userId = body.userId;
    const audio = Buffer.from(base64Audio, 'base64');
    const openai = getOpenAI();

    const file = await toFile(
      audio,
      userId + Date.now() + '-speechToTextInput.wav',
      { type: 'audio/wav' },
    );
    const data = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });

    return NextResponse.json(data);
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('/api/speech-to-text err:', error?.message);
    }

    return returnCommonStatusError(error?.message || '');
  }
}
