# V2 Changes — Bundle Expansion & Landing Copy Overhaul

## Bundle: 3 → 4 Courses

The front-end bundle was expanded from **3 courses** (SketchUp, V-Ray, D5 Render) to **4 courses** by adding **AutoCAD Mastery**.

### Files changed

- **`constants.tsx`** — Added AutoCAD (`id: '1'`) to `FRONT_END_IDS`. Reordered `FRONT_END_COURSES` to: AutoCAD → SketchUp → V-Ray → D5 Render.
- **`LandingHelpers.tsx`** — Added AutoCAD to `COURSES_LANDING` and `VALUE_STACK_ITEMS`. Updated `FAQ_ITEMS_LANDING` to reference 4 courses.
- **`LandingPage.tsx`** — All "3 courses" text changed to "4 courses".
- **`CheckoutPage.tsx`** — Bundle label updated to "AutoCAD + SketchUp + V-Ray + D5 Render Bundle". Course count updated to 4.
- **`PaymentModal.tsx`** — "3 Premium Courses" → "4 Premium Courses".
- **`OnetimePage.tsx`** — AutoCAD removed from the upsell (since it's now in the front-end bundle). Course count changed from 9 → 8.

---

## Landing Page Copy Overhaul

### Hero Section

**Before:**
> In Architecture & Design — Planning, Design & Rendering matter the most.

**After:** A pipeline narrative that connects each software to a role:

- **Planning** → AutoCAD (2D floor plans & blueprints)
- **Designing** → SketchUp (3D modeling from scratch)
- **Rendering** → V-Ray & D5 Render (photorealistic output)

The hero now tells a story: *you need all four tools to go from blank canvas to client-ready render*.

### Header

- Removed the logo + "Get Access" button sticky header.
- Replaced with a geolocation banner: **"Now Available in [Country] — Pay in [Currency]!"**

### CTA Widgets

- Updated `CallToActionWidget` copy to reference 4 courses and the full pipeline.

### FAQ

- Updated answers to reflect 4 courses and AutoCAD inclusion.
- Adjusted "What do I get?" answer to list all four tools.

### Checkout Button

- Removed "Pay $9 ·" prefix from the checkout submit button. Now just says **"Get Instant Access"**.
