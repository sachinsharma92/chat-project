import OpenAI from 'openai';
import { head, map } from 'lodash';
import { OpenAIError } from 'openai/error.mjs';

/**
 * Open AI object configuration
 * @returns
 */
export const getOpenAIConfiguration = () => {
  return {
    organization: process.env.OPENAI_ORGANIZATION,
    // this is stage key
    // if key is compromised, we will revoke the key access
    apiKey: process.env.OPENAI_PRIVATE_KEY,
  };
};

/**
 * Get open ai instance
 * @returns
 */
export const getOpenAI = () => {
  return new OpenAI(getOpenAIConfiguration());
};

/**
 * Open AI chat completion
 * @param messages
 * @param params
 * @returns
 */
export const getOpenAIChatCompletion = async (
  messages: { role: OpenAIError; message: string }[],
  params?: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming>,
): Promise<OpenAI.Chat.ChatCompletion.Choice | undefined> => {
  const openai = getOpenAI();
  const formattedMessages = map(messages, p => ({
    content: p.message,
    role: p?.role as any,
  }));
  const completion = await openai.chat.completions.create({
    messages: formattedMessages,
    max_tokens: 150,
    model: 'gpt-3.5-turbo',
    ...(params || {}),
  });

  return head(completion?.choices);
};
