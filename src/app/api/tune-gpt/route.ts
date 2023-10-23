import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import { getOpenAI } from '@/lib/openai';
import {
  returnApiUnauthorizedError,
  returnCommonStatusError,
} from '@/lib/utils/routes';
import camelCaseKeys from 'camelcase-keys';
import { head, last, toString } from 'lodash';
import { applyApiRoutesAuth } from '../botchat/route';
// import axios from 'axios';

export type TuneGPTBodyRequest = {
  action: 'fine-tune' | 'check-status' | 'get-model-id';
  modelName: string;
  jobId?: string;
  fileUrl?: string;
};

export async function POST(request: Request) {
  const payload: TuneGPTBodyRequest = await request.json();
  const { action, modelName, jobId } = payload;
  const openai = getOpenAI();

  const headers = request.headers;
  const authorization = headers.get('Authorization');
  const refreshToken = headers.get('X-RefreshToken') as string;
  const accessToken = last(toString(authorization).split('BEARER ')) as string;
  const authRes = await applyApiRoutesAuth(accessToken, refreshToken);
  const validAuth = authRes && !authRes?.error && accessToken && refreshToken;

  if (!validAuth) {
    return returnApiUnauthorizedError();
  }

  const page = await openai.fineTuning.jobs.list({ limit: 10 });
  const recentJob = head(page?.data || []);
  const jobIsRunning =
    recentJob?.id &&
    (!recentJob?.status ||
      recentJob?.status === 'queued' ||
      recentJob?.status === 'running' ||
      recentJob?.status === 'validating_files');

  // @todo block this endpoint for admin roles only
  if (action == 'fine-tune') {
    try {
      if (jobIsRunning) {
        // 1 job at a time
        return NextResponse.json(
          {
            message: `Job ${recentJob?.id} is running. Check dashboard.`,
          },
          {
            status: 200,
          },
        );
      }

      const fileUrl =
        payload?.fileUrl ||
        'https://eljnqwlzsyzxafjvzceb.supabase.co/storage/v1/object/public/botnet-assets/private-prompts/prompts.jsonl';
      const file = await openai.files.create({
        file: await fetch(fileUrl),
        purpose: 'fine-tune',
      });
      const fineTune = await openai.fineTuning.jobs.create({
        training_file: file.id,
        model: modelName,
      });
      const jobId = fineTune?.id;

      return NextResponse.json(
        {
          jobId,
          ...camelCaseKeys(fineTune as Record<string, any>),
        },
        {
          status: 200,
        },
      );
    } catch (err: any) {
      return returnCommonStatusError(err?.message);
    }
  } else if (action === 'check-status') {
    if (jobId) {
      const response = await openai.fineTuning.jobs.listEvents(jobId, {
        limit: 20,
      });
      const events = response.data;

      return NextResponse.json(
        {
          events,
        },
        {
          status: 200,
        },
      );
    } else {
      return returnCommonStatusError('Missing job id');
    }
  } else if (action === 'get-model-id') {
    if (jobId) {
      const response = await openai.fineTuning.jobs.retrieve(jobId);
      const fineTunedModelId = response?.fine_tuned_model;

      return NextResponse.json(
        {
          fineTunedModelId,
        },
        {
          status: 200,
        },
      );
    } else {
      return returnCommonStatusError('Missing job id');
    }
  }

  return returnCommonStatusError('Invalid action');
}
