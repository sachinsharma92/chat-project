// @ts-ignore
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async req => {
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    // @ts-ignore
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    // @ts-ignore
    Deno.env.get('CUSTOM_SUPABASE_PRIVATE_KEY') ?? '',
  );

  const requestionJson = await req.json();
  const userId = requestionJson?.record?.id || '';
  const data = {
    message: `Created public profile for user with id: ${userId}`,
  };

  if (userId) {
    console.log('sign-up-user-profile requestionJson', requestionJson);

    const payload = {
      id: globalThis.crypto.randomUUID(),
      deleted_at: null,
      updated_at: null,
      created_at: new Date().toISOString(),
      image: '',
      display_name: '',
      handle: '',
      space_id: globalThis.crypto.randomUUID(),
      user_id: userId,
    };

    const { error } = await supabaseClient.from('user_profiles').insert({
      ...payload,
    });

    if (error?.message) {
      console.log('sign-up-user-profile err:', error?.message);
    }
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
