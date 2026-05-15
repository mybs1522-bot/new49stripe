import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { products } = await req.json();
    if (!products || !Array.isArray(products)) throw new Error('products array is required');

    const LINKS: Record<string, string | undefined> = {
      render:   Deno.env.get('DRIVE_LINK_RENDER'),
      full:     Deno.env.get('DRIVE_LINK_FULL'),
      books:    Deno.env.get('DRIVE_LINK_BOOKS'),
      downsell: Deno.env.get('DRIVE_LINK_BOOKS_DOWNSELL'),
    };

    const links: Record<string, string> = {};
    for (const p of products) {
      if (LINKS[p]) links[p] = LINKS[p]!;
    }

    return new Response(JSON.stringify({ links }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
