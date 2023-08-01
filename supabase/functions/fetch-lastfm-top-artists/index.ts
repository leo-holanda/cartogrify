// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const { name } = await req.json();
  const lastFmApiKey = Deno.env.get("LASTFM_API_KEY") ?? "";

  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${name}&api_key=${lastFmApiKey}&format=json`
    );
    return response;
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
});
