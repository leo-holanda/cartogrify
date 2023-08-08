// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

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

  const textEncoder = new TextEncoder();
  const artistsNames = await req.json();
  const body = new ReadableStream({
    async start(controller) {
      for (const artistName of artistsNames) {
        controller.enqueue(textEncoder.encode("START_OF_JSON "));
        const artistsData = {
          name: artistName,
          page: await fetchArtistPage(artistName),
        };
        controller.enqueue(textEncoder.encode(JSON.stringify(artistsData)));
        controller.enqueue(textEncoder.encode("END_OF_JSON "));
      }
      controller.close();
    },
  });
  return new Response(body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
    },
  });
});
