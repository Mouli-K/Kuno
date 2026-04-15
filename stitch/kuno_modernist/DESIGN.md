# Design System Document: The Literary Curator

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Literary Curator."** 

Moving away from the cluttered, utility-first approach of traditional trackers, this system treats digital book collections with the reverence of a physical high-end archive. It leverages a "Flat-Plus" philosophy—maintaining a clean, modern aesthetic while using tonal depth and intentional asymmetry to create an editorial feel. The experience should feel like a premium digital magazine: spacious, authoritative, and sophisticated.

By eschewing traditional lines and borders, we force the user’s eye to follow content rather than containers. This system prioritizes the "breath" between elements, using generous white space to signify luxury and focus.

---

## 2. Colors: Tonal Sophistication
The palette is rooted in a deep Midnight Navy (`primary_container`), balanced by the neutrality of Stone Grey (`secondary`), and punctuated by a Crisp Coral (`on_tertiary_container`).

### The "No-Line" Rule
To achieve a high-end editorial look, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background color shifts or subtle tonal transitions. 
*   *Example:* A book list section (`surface_container_low`) should sit directly on the main `background` without a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the Material surface-container tiers to create "nested" depth:
*   **Base:** `surface` (#f8f9fa) – The canvas.
*   **Low-Level Nesting:** `surface_container_low` (#f3f4f5) – Use for secondary content areas.
*   **Active/Elevated Layers:** `surface_container_lowest` (#ffffff) – Reserved for the most important interactive cards to make them "pop" against the light grey background.

### The "Ghost Border" Fallback
If a border is required for extreme accessibility needs, use a **Ghost Border**: `outline_variant` at 15% opacity. Never use 100% opaque, high-contrast strokes.

---

## 3. Typography: The Editorial Voice
We use **Manrope**, a modern sans-serif with a geometric foundation and a human touch, to drive the brand identity.

*   **Display (lg/md/sm):** Set in `on_background` (#191c1d). Use these for book titles or reading milestones. The high contrast against the white background creates an immediate sense of authority.
*   **Headline & Title:** Used for navigation and section headers. High-contrast typography is the primary way we separate sections in the absence of lines.
*   **Body (lg/md):** Optimized for readability in reviews and synopses. 
*   **Labels:** Use `label-md` in `secondary` (#645d58) for metadata (e.g., "Page 240 of 300").

**Hierarchy Tip:** Always pair a `headline-lg` with a `body-md` in `on_surface_variant` to create a clear, sophisticated visual anchor.

---

## 4. Elevation & Depth: Tonal Layering
Depth is achieved through **Tonal Layering** rather than structural shadows.

*   **The Layering Principle:** To lift a book card, place a `surface_container_lowest` (Pure White) card on a `surface_container_low` (Light Grey) background. This creates a soft, natural lift.
*   **Ambient Shadows:** For floating elements (like a "Add Book" Fab), use an extra-diffused shadow:
    *   *Blur:* 24px
    *   *Opacity:* 4% - 6%
    *   *Color:* A tinted version of `on_primary_fixed_variant` (#3f465c) to mimic natural light.
*   **Glassmorphism:** For overlays and navigation bars, use `surface` at 85% opacity with a `20px` backdrop blur. This allows the book covers to bleed through subtly, maintaining a sense of place.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary_container` (#131b2e) with `on_primary` text. No rounding beyond 8px (`lg`).
*   **Secondary:** `secondary_container` (#eae1da) with `on_secondary_container` text.
*   **Tertiary (Accent):** `on_tertiary_container` (#de574b) used sparingly for "Start Reading" or "Finish" actions.

### Cards & Lists
*   **Card Styling:** No borders. Use `surface_container_highest` for hover states. 
*   **The Divider Rule:** Forbid the use of divider lines. Separate list items using `16px` of vertical white space or a 2% shift in background tone.

### Input Fields
*   **Minimalist Inputs:** Use a "filled" style with `surface_container_high`. The bottom border should only appear on focus using the `tertiary` coral accent to provide a "spark" of interactivity.

### Custom App Components
*   **The Progress Track:** A flat, thick bar using `surface_container_highest` as the track and `on_tertiary_container` (Coral) as the fill. 
*   **The Curator Grid:** Use asymmetric grid layouts for book discovery (e.g., one large "Featured" cover next to two smaller "Recent" covers) to break the "standard app" feel.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use the Coral accent (`on_tertiary_container`) only for primary calls to action or meaningful progress.
*   **Do** use 8px (`lg`) rounding consistently across all buttons, cards, and input fields.
*   **Do** utilize `primary_fixed_dim` for disabled states to keep the palette sophisticated rather than "greyed out."

### Don't:
*   **Don't** use 1px dividers. If you feel the need to separate, increase the white space.
*   **Don't** use pure black (#000000) for text. Use `on_background` (#191c1d) to maintain the "Stone Grey" soft aesthetic.
*   **Don't** use gradients. The "soul" of the design comes from the interplay of flat, sophisticated tones and high-end typography.