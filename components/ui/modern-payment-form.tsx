import React, { useState, useEffect, useRef } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { stripePromise, createPaymentIntent, FALLBACK_STRIPE_LINK, sendAccessEmail } from "@/services/stripe";
import { Card, CardContent } from "@/components/ui/card";
import { FaPaypal } from "react-icons/fa";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

const PAYPAL_CLIENT_ID = 'AWfIxiBeqQ5trh_bHZddIyMxwiXLEfmX0hKQdZfP0SxiupVbbT07-Z9PFihDwcblTUJqF79zs3y8f0eu';

function PayPalButton({ email, onSuccess, amount }: { email: string; onSuccess: () => void; amount: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ppReady, setPpReady] = useState(!!(window as any).paypal);
  const [ppError, setPpError] = useState('');

  // Keep refs to latest values so the PayPal onApprove closure never goes stale
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const emailRef = useRef(email);
  emailRef.current = email;

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) { setPpError('not-configured'); return; }
    if ((window as any).paypal) { setPpReady(true); return; }
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    s.onload = () => setPpReady(true);
    s.onerror = () => setPpError('load-failed');
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ppReady || !containerRef.current) return;
    containerRef.current.innerHTML = '';
    const amountVal = amount.replace(/[^\d.]/g, '');
    (window as any).paypal.Buttons({
      fundingSource: (window as any).paypal.FUNDING.PAYPAL,
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal', height: 52 },
      createOrder: (_: any, actions: any) =>
        actions.order.create({
          purchase_units: [{ amount: { value: amountVal }, description: 'Avada Design Bundle – All Courses' }],
          payer: { email_address: emailRef.current },
        }),
      onApprove: async (_: any, actions: any) => {
        await actions.order.capture();
        if ((window as any).fbq) (window as any).fbq('track', 'Purchase', { value: 49, currency: 'USD' });
        onSuccessRef.current();
      },
      onError: (e: any) => console.error('[PayPal]', e),
    }).render(containerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ppReady]);

  // Remove error message when email becomes valid
  useEffect(() => {
    if (email && email.includes('@')) {
      const existing = document.getElementById('pp-email-error');
      if (existing) existing.remove();
    }
  }, [email]);

  const handleOverlayClick = () => {
    const emailInput = document.querySelector('input[type="email"]') as HTMLElement;
    if (emailInput) {
      let errEl = document.getElementById('pp-email-error');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.id = 'pp-email-error';
        errEl.style.cssText = 'color:#ef4444;font-size:12px;margin:0 0 4px;font-weight:600;';
        errEl.textContent = 'Enter Your Mail Address';
        emailInput.parentElement?.parentElement?.insertBefore(errEl, emailInput.parentElement);
      }
      emailInput.classList.remove('shake-input');
      void emailInput.offsetWidth; // force reflow
      emailInput.classList.add('shake-input');
      emailInput.focus();
    }
  };

  if (ppError === 'not-configured') return (
    <div className="w-full py-3.5 bg-[#003087] rounded-xl flex items-center justify-center gap-2.5 opacity-40 cursor-not-allowed select-none">
      <FaPaypal size={22} className="text-white" />
      <span className="text-white font-bold text-base">PayPal — Client ID needed</span>
    </div>
  );

  if (ppError === 'load-failed') return null;

  if (!ppReady) return (
    <div className="w-full h-[52px] bg-[#003087]/10 rounded-xl animate-pulse" />
  );

  const needsEmail = !email || !email.includes('@');

  return (
    <div className="relative w-full" style={{ minHeight: 52 }}>
      <div
        ref={containerRef}
        className="w-full"
        style={needsEmail ? { pointerEvents: 'none' } : undefined}
      />
      {needsEmail && (
        <div
          onClickCapture={(e) => { e.stopPropagation(); e.preventDefault(); handleOverlayClick(); }}
          onMouseDownCapture={(e) => { e.stopPropagation(); e.preventDefault(); }}
          className="absolute top-0 left-0 w-full h-full cursor-pointer"
          style={{ zIndex: 9999 }}
        />
      )}
    </div>
  );
}

const appearance: Appearance = {
  theme: "stripe",
  variables: { colorPrimary: "#111827", fontFamily: "Inter, system-ui, sans-serif" },
};

interface CheckoutFormProps {
  email: string;
  onSuccess: (customerId?: string, paymentMethodId?: string, paymentIntentId?: string) => void;
  onBack?: () => void;
  amount: string;
  customerId?: string;
}

function CheckoutForm({ email, onSuccess, onBack, amount, customerId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Hide Stripe mandate / terms text (e.g. Amazon Pay, card save disclosures)
  useEffect(() => {
    const hide = () => {
      if (!formRef.current) return;
      formRef.current.querySelectorAll('div, p').forEach((el) => {
        const text = (el as HTMLElement).innerText || '';
        if (
          /by (confirming|providing|submitting)/i.test(text) &&
          /future payments|in accordance/i.test(text)
        ) {
          (el as HTMLElement).style.display = 'none';
        }
      });
    };
    hide();
    const observer = new MutationObserver(hide);
    if (formRef.current) observer.observe(formRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if ((window as any).fbq) (window as any).fbq('track', 'AddPaymentInfo');
    setIsLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: { email: email || undefined },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message ?? "Payment failed. Please try again.");
      setIsLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 9;
      if ((window as any).fbq) (window as any).fbq('track', 'Purchase', { value: numericAmount, currency: 'USD' });
      let paymentMethodId = typeof paymentIntent.payment_method === 'string'
        ? paymentIntent.payment_method
        : paymentIntent.payment_method?.id;
      // If payment_method not in response, retrieve the PaymentIntent to get it
      if (!paymentMethodId && paymentIntent.id && stripe) {
        try {
          const retrieved = await stripe.retrievePaymentIntent(paymentIntent.client_secret || '');
          if (retrieved.paymentIntent?.payment_method) {
            paymentMethodId = typeof retrieved.paymentIntent.payment_method === 'string'
              ? retrieved.paymentIntent.payment_method
              : retrieved.paymentIntent.payment_method?.id;
          }
        } catch (e) { console.warn('[Stripe] Could not retrieve paymentMethod:', e); }
      }
      console.log('[CheckoutForm] paymentMethodId:', paymentMethodId, 'paymentIntentId:', paymentIntent.id);
      onSuccess(customerId, paymentMethodId, paymentIntent.id);
    } else {
      setMessage("Unexpected state — please contact support.");
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

      {/* Stripe PaymentElement — renders card, iDEAL, Bancontact, etc. based on location */}
      <PaymentElement options={{
        layout: { type: 'accordion', defaultCollapsed: false, spacedAccordionItems: true },
        defaultValues: { billingDetails: { email: email || undefined } },
        terms: { card: 'never', auBecsDebit: 'never', bancontact: 'never', ideal: 'never', sepaDebit: 'never', sofort: 'never', usBankAccount: 'never' },
        wallets: { applePay: 'auto', googlePay: 'auto', link: 'never' },
      }} />

      {email && (
        <p className="text-xs text-gray-400 text-center">
          Receipt → <span className="font-semibold text-gray-600">{email}</span>
        </p>
      )}

      {message && (
        <p className="text-red-500 text-xs text-center bg-red-50 p-2.5 rounded-xl border border-red-100">{message}</p>
      )}

      <button type="submit" disabled={!stripe || !elements || isLoading}
        className="w-full h-12 bg-gray-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 transition-all">
        {isLoading ? <><Loader2 size={18} className="animate-spin" /> Processing…</> : `Pay ${amount} · Get Instant Access`}
      </button>

      {/* PayPal */}
      <div>
        <div className="flex items-center gap-3 text-gray-600 mb-3">
          <hr className="flex-grow border-gray-300" />
          <span className="text-xs font-bold whitespace-nowrap text-gray-400">or pay with</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <PayPalButton email={email} onSuccess={onSuccess} amount={amount} />
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
        <span className="flex items-center gap-1"><Lock size={10} /> SSL Secured</span>
        <span>•</span>
        <span className="flex items-center gap-1"><ShieldCheck size={10} /> 7-Day Refund</span>
        <span>•</span>
        <span>Lifetime Access</span>
      </div>
    </form>
  );
}

interface ModernPaymentFormProps {
  email: string;
  onSuccess: (customerId?: string, paymentMethodId?: string, paymentIntentId?: string) => void;
  onBack?: () => void;
  amount?: string;
  bare?: boolean;
}

export default function ModernPaymentForm({
  email,
  onSuccess,
  onBack,
  amount = "$9",
  bare = false,
}: ModernPaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [initError, setInitError] = useState('');

  // Create PaymentIntent after email is fully typed (debounced 800ms + strict regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = emailRegex.test(email);
  const [debouncedEmail, setDebouncedEmail] = useState('');

  useEffect(() => {
    if (!isEmailValid) return;
    const timer = setTimeout(() => setDebouncedEmail(email), 800);
    return () => clearTimeout(timer);
  }, [email, isEmailValid]);

  useEffect(() => {
    if (!debouncedEmail) return;
    let cancelled = false;
    createPaymentIntent(debouncedEmail, amount)
      .then((res) => {
        if (!cancelled) {
          setClientSecret(res.clientSecret);
          setCustomerId(res.customerId);
        }
      })
      .catch((err) => {
        if (!cancelled) setInitError(err?.message ?? 'Failed to initialise payment.');
      });
    return () => { cancelled = true; };
  }, [debouncedEmail, amount]);

  const wrap = (content: React.ReactNode) =>
    bare ? (
      <div className="border-t border-gray-100 mt-3 pt-4">{content}</div>
    ) : (
      <Card className="max-w-md w-full rounded-2xl shadow-2xl border-0">
        <CardContent className="p-6">{content}</CardContent>
      </Card>
    );

  if (initError) return wrap(
    <p className="text-red-500 text-sm text-center py-4">{initError}</p>
  );

  if (!clientSecret) return wrap(
    <div className="flex flex-col items-center gap-3 py-6">
      <Loader2 size={24} className="animate-spin text-gray-400" />
      <p className="text-xs text-gray-400">Preparing secure checkout…</p>
    </div>
  );

  return wrap(
    <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
      <CheckoutForm email={email} onSuccess={onSuccess} onBack={onBack} amount={amount} customerId={customerId} />
    </Elements>
  );
}
