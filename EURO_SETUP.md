# Euro Project Setup — All Payment Methods

## Overview
Exact changes needed to run this project with EUR currency and all payment methods enabled.
Uses the same Supabase backend and Stripe account.

---

## Step 1: Frontend — `components/ui/modern-payment-form.tsx`

### Change 1: Elements currency
Find this line (~line 289):
```tsx
options={{ appearance, mode: 'payment', amount: numericAmount, currency: 'usd', setupFutureUsage: 'off_session' }}
```
Change to:
```tsx
options={{ appearance, mode: 'payment', amount: numericAmount, currency: 'eur', setupFutureUsage: 'off_session' }}
```

### Change 2: Pass currency to createPaymentIntent on submit
Find this line in `handleSubmit` (~line 178):
```tsx
const res = await createPaymentIntent(email || '', amount);
```
Change to:
```tsx
const res = await createPaymentIntent(email || '', amount, 'eur');
```

---

## Step 2: Display prices — `constants.tsx`

Change all `$` price strings to `€`:
```tsx
// Examples:
"$9"  → "€9"
"$27" → "€27"
"$47" → "€47"
```

---

## Step 3: Stripe Dashboard — Enable EUR Payment Methods

Go to: **https://dashboard.stripe.com/settings/payment_methods**

Enable these for EUR (toggle ON in the **default** config):
- Card (already on)
- Apple Pay / Google Pay (already on via Card)
- iDEAL
- Bancontact
- SEPA Direct Debit
- Klarna
- Giropay
- EPS
- Przelewy24 (P24)
- Sofort

Stripe will automatically show only EUR-compatible methods from this list.

**Important**: The default config controls what shows in deferred mode (no PI on page load).
The custom config `pmc_1TVz0fGGsoQTkhyve6oTQ6jG` only applies when a PI is created.

---

## Step 4: Backend — No Changes Needed

The edge function already handles EUR:
- `create-payment-intent/index.ts` → uses `currency` from request body, defaults to `usd`
- `charge-saved-card-upsell/index.ts` → charges in whatever currency the original PI used
- `services/stripe.ts` → already passes `currency` param

The `payment_method_configuration: 'pmc_1TVz0fGGsoQTkhyve6oTQ6jG'` on the backend
will accept any payment method enabled in that config regardless of currency.

---

## Summary of Changes

| File | Change | Lines |
|------|--------|-------|
| `modern-payment-form.tsx` | `currency: 'usd'` → `currency: 'eur'` | ~289 |
| `modern-payment-form.tsx` | Add `'eur'` to `createPaymentIntent` call | ~178 |
| `constants.tsx` | `$` → `€` in all price strings | multiple |
| Stripe Dashboard | Enable EUR methods in default config | N/A |
| Backend | **Nothing** | — |

---

## Testing

1. Run `npm run dev`
2. Open checkout page
3. Should see Card + EUR methods (iDEAL, Bancontact, etc.)
4. Test with Stripe test card `4242424242424242`
5. Check Stripe Dashboard → Payments → verify currency shows `EUR`

---

## Will This Impact the USD Project?

**No.** The USD project:
- Hardcodes `currency: 'usd'` in its own `modern-payment-form.tsx`
- Passes no currency (defaults to `usd`) in `createPaymentIntent`
- Uses the same Supabase edge functions (they're currency-agnostic)
- Uses the same Stripe account (Stripe handles multi-currency natively)
