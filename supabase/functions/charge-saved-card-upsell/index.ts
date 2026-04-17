import Stripe from 'https://esm.sh/stripe@15.0.0?target=deno&no-check';
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { customerId, amount } = await req.json();
    let numericAmount = 2700; // default $27
    if (amount) {
      const cleanAmount = amount.replace(/[^0-9.]/g, '');
      numericAmount = Math.round(parseFloat(cleanAmount) * 100);
    }

    if (!customerId) {
        throw new Error('Customer ID is required');
    }

    // Retrieve customer's saved payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
      limit: 1,
    });

    if (paymentMethods.data.length === 0) {
      throw new Error('No saved payment methods found for this customer.');
    }

    const defaultPaymentMethodId = paymentMethods.data[0].id;

    // Charge the card immediately (off_session)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: numericAmount,
      currency: 'usd',
      customer: customerId,
      payment_method: defaultPaymentMethodId,
      off_session: true,
      confirm: true, // Attempt to confirm the payment immediately
      metadata: { product: 'Avada Design Bundle Upsell' },
    });

    return new Response(
      JSON.stringify({ success: true, paymentIntentId: paymentIntent.id, status: paymentIntent.status }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
