import OpenAI from 'openai';
import { head, map } from 'lodash';
import { OpenAIError } from 'openai/error.mjs';

export const getOpenAIConfiguration = () => {
  return {
    organization: process.env.OPENAI_ORGANIZATION,
    // this is stage key
    // if key is compromised, we will revoke the key access
    apiKey: process.env.OPENAI_PRIVATE_KEY,
  };
};

export const getOpenAI = () => {
  return new OpenAI(getOpenAIConfiguration());
};

export const getOpenAIChatCompletion = async (
  messages: { role: OpenAIError; message: string }[],
  model?: string,
): Promise<OpenAI.Chat.ChatCompletion.Choice | undefined> => {
  const openai = getOpenAI();
  const formattedMessages = map(messages, p => ({
    content: p.message,
    role: p?.role as any,
  }));
  const completion = await openai.chat.completions.create({
    messages: formattedMessages,
    max_tokens: 150,
    model: model || 'gpt-3.5-turbo',
  });

  return head(completion?.choices);
};
