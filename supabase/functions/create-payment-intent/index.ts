import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STRIPE_SECRET = () => Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const STRIPE_API = 'https://api.stripe.com/v1';

async function stripePost(endpoint: string, params: Record<string, string>) {
  const res = await fetch(`${STRIPE_API}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2024-12-18.acacia',
    },
    body: new URLSearchParams(params).toString(),
  });
  return res.json();
}

async function stripeGet(endpoint: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${STRIPE_API}${endpoint}${qs}`, {
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET()}`,
      'Stripe-Version': '2024-12-18.acacia',
    },
  });
  return res.json();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, amount, currency } = await req.json();
    let numericAmount = 900; // default $9
    if (amount) {
      const cleanAmount = amount.replace(/[^0-9.]/g, '');
      numericAmount = Math.round(parseFloat(cleanAmount) * 100);
    }

    // Find or create customer (required to save card)
    let customerId: string | undefined = undefined;
    if (email) {
      const existing = await stripeGet('/customers', { email, limit: '1' });
      if (existing.data?.length > 0) {
        customerId = existing.data[0].id;
      } else {
        const newCust = await stripePost('/customers', { email });
        customerId = newCust.id;
      }
    }

    // Create PaymentIntent with raw API call to ensure all params are sent
    const piParams: Record<string, string> = {
      amount: String(numericAmount),
      currency: currency || 'usd',
      setup_future_usage: 'off_session',
      'metadata[product]': 'Avada Design Bundle',
      payment_method_configuration: 'pmc_1TVz0fGGsoQTkhyve6oTQ6jG',
      'excluded_payment_method_types[0]': 'us_bank_account',
      'excluded_payment_method_types[1]': 'klarna',
    };
    if (customerId) piParams.customer = customerId;
    if (email) piParams.receipt_email = email;

    const paymentIntent = await stripePost('/payment_intents', piParams);

    if (paymentIntent.error) {
      throw new Error(paymentIntent.error.message);
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        customerId,
        _v: 'v8-debug',
        _methods: paymentIntent.payment_method_types,
        _config: paymentIntent.payment_method_configuration_details,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
