// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { name } = await req.json();
    const lastFmApiKey = Deno.env.get("LASTFM_API_KEY") ?? "";
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${name}&api_key=${lastFmApiKey}&format=json&limit=40`
    );

    return new Response(JSON.stringify(await response.json()), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
});
