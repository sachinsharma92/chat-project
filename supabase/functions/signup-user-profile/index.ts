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

  const requestJson = await req.json();
  const userId = requestJson?.record?.id || '';
  const email = `${requestJson?.record?.email || ''}`.trim();
  const displayName = email.split('@')[0] || '';
  const data = {
    message: `Created public profile for user with id: ${userId}`,
  };

  if (userId) {
    console.log('sign-up-user-profile requestionJson', requestJson);

    const spaceId = globalThis.crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const userProfilePayload = {
      id: globalThis.crypto.randomUUID(),
      deleted_at: null,
      updated_at: null,
      created_at: createdAt,
      image: '',
      display_name: displayName,
      handle: '',
      space_id: spaceId,
      user_id: userId,
    };
    const spaceProfilePayload = {
      id: spaceId,
      space_id: spaceId,
      owner: userId,
      deleted_at: null,
      updated_at: null,
      created_at: createdAt,
      space_name: '',
      description: '',
    };

    const { error: userProfileCreateError } = await supabaseClient
      .from('user_profiles')
      .insert({
        ...userProfilePayload,
      });
    const { error: spacesProfileCreateError } = await supabaseClient
      .from('spaces_profiles')
      .insert({
        ...spaceProfilePayload,
      });

    if (userProfileCreateError?.message) {
      console.log(
        'sign-up-user-profile user_profiles err:',
        userProfileCreateError?.message,
      );
    }

    if (spacesProfileCreateError?.message) {
      console.log(
        'sign-up-user-profile spaces_profiles err:',
        userProfileCreateError?.message,
      );
    }
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
