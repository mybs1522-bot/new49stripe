# Prompt: Replicate ThankYou Page + Upsell Fixes for EUR Project

> This project is in **EUR (€)** and uses the **same Supabase backend** (project ref: `aexrgtpxyzfxjecozstf`). Apply all changes below.

---

## 1. PayPal Email Fix (modern-payment-form.tsx)

The PayPal `onApprove` callback suffers from stale closures — it captures `email` and `onSuccess` at render time and never updates. Fix this:

- Add `useRef` for `onSuccess` and `email` inside the `PayPalButton` component. Update `.current` on every render so the PayPal `onApprove` closure always reads fresh values.
- Add a **DOM overlay** on top of the PayPal button when email is empty/invalid (`!email || !email.includes('@')`). The overlay intercepts clicks, shows a red error message "Enter Your Mail Address" above the email input, applies a CSS shake animation, and focuses the email input.
- Add a `useEffect` that removes the error message when email becomes valid.
- Add `@keyframes shake-input` CSS (in `index.html` `<style>` block):
```css
@keyframes shake-input {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.shake-input { animation: shake-input 0.4s ease-in-out; }
```

---

## 2. Track `purchased[]` Through the Funnel

Every page in the upsell funnel must pass a `purchased` array via `location.state` so the ThankYou page knows what the user bought.

### CheckoutPage.tsx
In `handleSuccess`, add `purchased: ['render']` to navigation state:
```tsx
navigate("/onetime", { state: { customerId, paymentMethodId, paymentIntentId, email, purchased: ['render'] } });
```

### OnetimePage.tsx
- Read `prevPurchased` from state: `const prevPurchased: string[] = location.state?.purchased ?? ['render'];`
- On success (user buys full bundle): `purchased: [...prevPurchased, 'full']`
- On skip: `purchased: prevPurchased`
- Apply to ALL navigate calls (handleSuccess, handleSkip, skip buttons)

### OfferPage.tsx
- Read `prevPurchased` from state the same way
- On success (books/downsell): `navigate("/thankyou", { state: { ..., purchased: [...prevPurchased, productMode] } })`
- On skip: `navigate("/thankyou", { state: { ..., purchased: prevPurchased } })`
- **Remove the old inline success screen** — replace it with navigation to `/thankyou`

### RenderUpsellPage.tsx (if exists)
- On success: `purchased: ['render']`
- On skip: `purchased: []`

---

## 3. Fix EmailProduct Type (services/email.ts)

Change the `EmailProduct` type to match what the edge function actually accepts:
```ts
export type EmailProduct =
  | 'sketchup'
  | 'render'
  | 'full'
  | 'books'
  | 'downsell';
```

---

## 4. Add `getAccessLinks` Function (services/stripe.ts)

Add this function to fetch Drive links from the already-deployed `get-access-links` edge function:
```ts
export const getAccessLinks = async (products: string[]): Promise<Record<string, string>> => {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/get-access-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ products }),
    });
    const data = await res.json();
    return data.links ?? {};
  } catch (err) {
    console.error('[getAccessLinks] failed:', err);
    return {};
  }
};
```

The `get-access-links` edge function is **already deployed** on Supabase. It reads `DRIVE_LINK_RENDER`, `DRIVE_LINK_FULL`, `DRIVE_LINK_BOOKS`, `DRIVE_LINK_BOOKS_DOWNSELL` from env secrets and returns them. No need to redeploy.

---

## 5. Create ThankYou Page (pages/ThankYouPage.tsx)

Create a new page at `/thankyou` with these sections in order:

### a) WhatsApp Top Bar
Green bar at the very top: "Need help? Chat on WhatsApp →" linking to `https://wa.me/919198747810`

### b) Success Header
- Green gradient background with confetti animation
- Big checkmark icon
- "Payment Confirmed!"
- "Your order is complete. Access everything below."
- Highlighted pill: "If link not received — WhatsApp at +91 91987 47810" (clickable)
- Email confirmation badge: "Confirmation sent to {email}"

### c) Your Purchases Section
For each product in `purchased[]`, show a card with:
- Gradient header (blue for render, orange for full, emerald for books)
- Product title + subtitle
- Items list with checkmarks
- **Visible Drive link URL** fetched from `getAccessLinks()` — shown as clickable text
- **Copy button** next to the link (copies to clipboard, shows "Copied!" for 2 seconds)
- Fallback message if link not loaded: "📧 Access link sent to your email"

### d) Buy Now Section ("Complete Your Library")
Show cards for products the user did NOT purchase:
- If `full` not in purchased → show 9-Course Bundle card (€27)
- If `books` and `downsell` not in purchased → show 6 Books card (€36)
- Each card shows: product icon, title, subtitle, price (with strikethrough original), first 4 items + "+X more"
- **"Add to My Library"** button that:
  1. Tries one-click charge via `chargeSavedCardUpsell()` using saved `customerId`/`paymentMethodId`
  2. If fails → shows payment modal with email pre-filled (uses `ModernPaymentForm` with `bare` prop)
  3. On success → sends access email via `sendStageEmail()`, adds to `purchased[]` state, fetches new link

### e) Bookmark Reminder
Blue info box: "📌 Bookmark This Page — Press Ctrl+D to bookmark"

### f) Support Section
Green box with WhatsApp chat button

### g) Email Fallback
Gray box: "All access links were also sent to {email}" + "Open Email App" button

### h) Social Proof
5 stars + testimonial quote + "50,000+ students worldwide"

### i) Payment Modal
Fixed overlay modal for Buy Now fallback — shows product title, price badge, read-only email input, and `ModernPaymentForm` with `bare` prop.

---

## 6. Add Route (App.tsx)

```tsx
import ThankYouPage from './pages/ThankYouPage';
// Inside <Routes>:
<Route path="/thankyou" element={<ThankYouPage />} />
```

---

## 7. EUR-Specific Changes

Since this project is in EUR, make sure:
- All prices display as `€` not `$` (e.g., `€9`, `€27`, `€36`)
- `currency: 'eur'` in `create-payment-intent` edge function
- `currency: 'EUR'` in Facebook pixel events
- The `createPaymentIntent` client-side call passes `'eur'` as currency parameter
- Buy Now buttons on ThankYou page show `€` prices

---

## 8. Important Notes

- **Same Supabase project** (`aexrgtpxyzfxjecozstf`) — all edge functions (`create-payment-intent`, `charge-saved-card-upsell`, `send-access-email`, `get-access-links`) are shared
- **Same Drive links** — the `get-access-links` function returns the same links regardless of currency
- **Same email templates** — `send-access-email` handles all products
- The ThankYou page replaces the old inline success screen in OfferPage
- Product constants (`FRONT_END_PRICE`, `UPSELL_PRICE`, etc.) should use the same numeric values but display with `€`
