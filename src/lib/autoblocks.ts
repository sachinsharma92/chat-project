import { AutoblocksTracer } from '@autoblocks/client';

/**
 * Autoblocks env variable
 * @returns
 */
export const getAutoblocksConfiguration = () => {
  return {
    ingestionKey: process.env.AUTOBLOCKS_INGESTION_KEY || '',
  };
};

/**
 * Create autoblocks tracer instance
 * @param traceId
 * @param provider
 * @returns
 */
export const getAutoblocksTracer = (
  traceId: string,
  provider?: 'openai' | '',
) =>
  new AutoblocksTracer(getAutoblocksConfiguration()?.ingestionKey, {
    traceId,
    properties: {
      provider,
    },
  });
