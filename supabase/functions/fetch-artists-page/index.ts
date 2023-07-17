// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function fetchArtistPage(artistName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await fetch("https://www.last.fm/music/" + artistName.replace(" ", "+"));
        const page = await response.text();
        resolve(page);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const artistsNames = await req.json();
  const artistsData = [];
  for (const artistName of artistsNames) {
    artistsData.push({
      name: artistName,
      page: await fetchArtistPage(artistName),
    });
  }

  return new Response(JSON.stringify(artistsData), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
