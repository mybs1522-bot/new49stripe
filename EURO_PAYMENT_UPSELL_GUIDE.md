# Euro Project — Payment Intent + Upsell Complete Guide

## Overview
All changes needed so checkout + one-click upsell works with EUR currency.
Same Supabase backend, same Stripe account.

---

## PART 1: Checkout (Initial Payment)

### File: `components/ui/modern-payment-form.tsx`

**Change 1 — Elements currency (~line 289):**
```tsx
// FIND:
currency: 'usd'
// REPLACE WITH:
currency: 'eur'
```

**Change 2 — createPaymentIntent call in handleSubmit (~line 178):**
```tsx
// FIND:
const res = await createPaymentIntent(email || '', amount);
// REPLACE WITH:
const res = await createPaymentIntent(email || '', amount, 'eur');
```

**Change 3 — Facebook pixel currency in handleSubmit (~line 204):**
```tsx
// FIND:
currency: 'USD'
// REPLACE WITH:
currency: 'EUR'
```

### File: `constants.tsx`
Change all price display strings:
```
"$9"  → "€9"
"$27" → "€27"
"$47" → "€47"
```

---

## PART 2: Upsell (One-Click Charge Saved Card)

### How the upsell flow works:
1. Checkout page creates PI with `setup_future_usage: 'off_session'` + customer
2. After payment, `customerId`, `paymentMethodId`, `paymentIntentId` are passed via `location.state` to upsell pages
3. Upsell pages call `chargeSavedCardUpsell()` which hits the `charge-saved-card-upsell` edge function
4. Edge function creates a new PI with the saved card and confirms it immediately

### CRITICAL — Backend hardcodes USD!

### File: `supabase/functions/charge-saved-card-upsell/index.ts`

**Change (line 81):**
```ts
// FIND:
currency: 'usd',
// REPLACE WITH:
currency: 'eur',
```

After changing, redeploy:
```bash
npx supabase functions deploy charge-saved-card-upsell --project-ref aexrgtpxyzfxjecozstf
```

⚠️ WARNING: This edge function is SHARED with the USD project.
If you change it to 'eur', USD upsells will break.

**Better approach — make it dynamic:**

Change line 81 from:
```ts
currency: 'usd',
```
To:
```ts
currency: body.currency || 'usd',
```

Then pass currency from the frontend (see below).

### File: `services/stripe.ts`

**Change `chargeSavedCardUpsell` function (line 53):**
```ts
// FIND:
export const chargeSavedCardUpsell = async (customerId: string, amount: string = '$27', paymentMethodId?: string, paymentIntentId?: string): Promise<boolean> => {

// REPLACE WITH:
export const chargeSavedCardUpsell = async (customerId: string, amount: string = '$27', paymentMethodId?: string, paymentIntentId?: string, currency: string = 'usd'): Promise<boolean> => {
```

**Change the body (line 63):**
```ts
// FIND:
body: JSON.stringify({ customerId, amount, paymentMethodId, paymentIntentId }),
// REPLACE WITH:
body: JSON.stringify({ customerId, amount, paymentMethodId, paymentIntentId, currency }),
```

### File: `pages/OnetimePage.tsx`

**Change upsell call (~line 63):**
```tsx
// FIND:
await chargeSavedCardUpsell(customerId, `$${UPSELL_PRICE}`, paymentMethodId, paymentIntentId);
// REPLACE WITH:
await chargeSavedCardUpsell(customerId, `€${UPSELL_PRICE}`, paymentMethodId, paymentIntentId, 'eur');
```

**Change Facebook pixel (~line 49):**
```tsx
currency: "USD"  →  currency: "EUR"
```

### File: `pages/OfferPage.tsx`

**Change upsell call (~line 63):**
```tsx
// FIND:
await chargeSavedCardUpsell(customerId, `$${UPSELL2_PRICE}`, paymentMethodId, paymentIntentId);
// REPLACE WITH:
await chargeSavedCardUpsell(customerId, `€${UPSELL2_PRICE}`, paymentMethodId, paymentIntentId, 'eur');
```

**Change downsell call (~line 81):**
```tsx
// FIND:
await chargeSavedCardUpsell(customerId, `$${DOWNSELL_BOOKS_PRICE}`, paymentMethodId, paymentIntentId);
// REPLACE WITH:
await chargeSavedCardUpsell(customerId, `€${DOWNSELL_BOOKS_PRICE}`, paymentMethodId, paymentIntentId, 'eur');
```

**Change Facebook pixel (~line 50):**
```tsx
currency: "USD"  →  currency: "EUR"
```

### File: `pages/RenderUpsellPage.tsx`

**Change upsell call (~line 59):**
```tsx
// FIND:
await chargeSavedCardUpsell(customerId, `$${FRONT_END_PRICE}`, paymentMethodId);
// REPLACE WITH:
await chargeSavedCardUpsell(customerId, `€${FRONT_END_PRICE}`, paymentMethodId, undefined, 'eur');
```

**Change Facebook pixel (~line 46):**
```tsx
currency: "USD"  →  currency: "EUR"
```

### File: `pages/CheckoutPage.tsx`

**Change Facebook pixel (~line 35):**
```tsx
currency: "USD"  →  currency: "EUR"
```

---

## PART 3: Stripe Dashboard

Go to: **https://dashboard.stripe.com/settings/payment_methods**

Enable EUR methods in the **default** config:
- Card, Apple Pay, Google Pay (already on)
- iDEAL, Bancontact, SEPA Direct Debit
- Klarna, Giropay, EPS, P24, Sofort

Stripe auto-filters by currency — only EUR-compatible ones will show.

---

## PART 4: Backend Edge Function Change

Only ONE backend change needed — make currency dynamic:

### File: `supabase/functions/charge-saved-card-upsell/index.ts`
```ts
// Line 81 — FIND:
currency: 'usd',
// REPLACE WITH:
currency: body.currency || 'usd',
```

Then redeploy:
```bash
npx supabase functions deploy charge-saved-card-upsell --project-ref aexrgtpxyzfxjecozstf
```

`create-payment-intent` already accepts currency dynamically — no change needed there.

---

## Complete File Change Summary

| File | What to change |
|------|---------------|
| `modern-payment-form.tsx` | `currency: 'usd'` → `'eur'` (2 places) |
| `constants.tsx` | `$` → `€` in price strings |
| `services/stripe.ts` | Add `currency` param to `chargeSavedCardUpsell` |
| `charge-saved-card-upsell/index.ts` | `currency: 'usd'` → `body.currency \|\| 'usd'` |
| `OnetimePage.tsx` | Pass `'eur'` to upsell call + FB pixel |
| `OfferPage.tsx` | Pass `'eur'` to upsell/downsell calls + FB pixel |
| `RenderUpsellPage.tsx` | Pass `'eur'` to upsell call + FB pixel |
| `CheckoutPage.tsx` | FB pixel currency only |

---

## Testing Checklist

1. Checkout shows EUR payment methods (Card, iDEAL, etc.)
2. Payment completes and Stripe Dashboard shows EUR
3. Upsell page charges saved card in EUR (not USD)
4. Downsell page charges saved card in EUR
5. If one-click fails, fallback payment form shows EUR methods
6. All FB pixels fire with `currency: "EUR"`
