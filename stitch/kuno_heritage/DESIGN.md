# Design System Strategy: The Literary Sanctuary

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Digital Private Library."** We are not building a utility-heavy database; we are crafting a curated, intimate sanctuary for bibliophiles. The experience must feel like a quiet afternoon in a sun-drenched study—tactile, warm, and intentional.

To achieve this, we break from the "Template Era." We reject rigid, boxed-in grids in favor of **Editorial Asymmetry**. By using expansive white space (the "Warm Linen" background) and overlapping elements, we create a sense of physical depth. The UI should feel less like software and more like a high-end literary journal, where the book covers are the art and the interface is the elegant frame.

## 2. Colors & Atmospheric Layering
The palette is grounded in organic, paper-like tones. We use temperature to guide the eye rather than high-contrast alerts.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the separation the eye needs. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine, heavy-weight paper.
*   **Surface (Base):** The foundation of the page.
*   **Surface-Container-Low:** For secondary content blocks.
*   **Surface-Container-Lowest:** For primary interactive cards that need to "pop" forward.
*   **Surface-Container-Highest:** For persistent navigation or high-level overlays.

### The Glass & Gradient Rule
To move beyond a flat, "out-of-the-box" digital feel, utilize semi-transparent layers for floating elements (e.g., Modals or Floating Action Buttons). Use the `surface` color at 80% opacity with a `24px` backdrop-blur to create a "frosted glass" effect that allows the warm linen background to bleed through. For primary CTAs, apply a subtle linear gradient from `primary` (#864e1e) to `primary_container` (#a36634) at a 45-degree angle to simulate the depth of a leather book spine.

## 3. Typography: The Editorial Voice
Our typography scale leverages the contrast between the authoritative, classical **Playfair Display** (Newsreader/Serif) and the functional clarity of **Inter** (Sans-serif).

*   **Display & Headlines:** Use Serif for all `display-` and `headline-` levels. These should be set with tighter letter-spacing (-2%) to feel like a printed masthead.
*   **Body & Labels:** Use Inter for `body-` and `label-` levels. These provide the modern, legible contrast required for book metadata and long-form reviews.
*   **Tonal Hierarchy:** Primary titles use `on_surface` (#1c1c19), while meta-information (author name, page counts) uses `on_surface_variant` (#52443a) to create a soft, non-competing visual hierarchy.

## 4. Elevation & Depth
In this system, "Elevation" is a feeling, not just a CSS property.

*   **Tonal Layering:** Achieve 90% of your hierarchy by "stacking" surface tiers. A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural lift without a single shadow.
*   **Ambient Shadows:** For floating elements (Modals, Dropdowns), use a "Whisper Shadow": `0 12px 32px rgba(44, 36, 22, 0.06)`. Note the tint: the shadow is a deep brown, not grey, ensuring it feels like a natural shadow on a wooden desk.
*   **The Ghost Border Fallback:** If accessibility requires a stroke, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.
*   **The "Reading Progress" Glow:** Use the `tertiary` (#8d464f) or `accent` (#C17F4A) colors for progress bars, but give them a soft inner-shadow to make them look recessed into the "paper" of the surface.

## 5. Components

### Buttons
*   **Primary:** `xl` (24px) radius. Filled with the signature Amber-to-Chocolate gradient. Label: `title-sm` (Inter, Bold).
*   **Secondary:** `xl` (24px) radius. Transparent background with a `ghost-border`. 
*   **Pill/Action:** `full` (999px) radius. Used for "Read/Unread" status toggles.

### Cards & Lists
*   **The "No-Divider" Rule:** Never use horizontal lines to separate list items. Use vertical white space (`16px` minimum) or alternating tonal shifts (e.g., every second item sits on a `surface-container-low` background).
*   **Book Cards:** Book covers should have a `sm` (4px) corner radius to mimic the slight rounding of a physical hardcover.

### Inputs & Fields
*   **Text Inputs:** Soft `md` (12px) radius. Use `surface-container-highest` for the background to create a "recessed" feel. The focus state should never be a heavy outline; instead, shift the background to `surface-container-lowest` and increase the shadow depth.

### Context-Specific Components
*   **The "Library Shelf" (Carousel):** A horizontally scrolling list where the active book is slightly scaled up (1.05x) and uses a more pronounced Ambient Shadow to appear "pulled" from the shelf.
*   **The "Reading Streak" Chip:** A `full` pill using `accent_soft` (#F0DFC8) background with `primary` text.

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Align headings to the left while keeping body text slightly indented to create an editorial layout.
*   **Use Large Type Scales:** Don't be afraid to make a "Book Title" very large (`display-sm`) if it is the hero of the screen.
*   **Respect the Warmth:** Ensure all shadows and blurs maintain a brown/amber tint. Never use pure black or grey.

### Don’t:
*   **Don't use 1px Dividers:** It breaks the "Library Sanctuary" illusion and makes the app feel like a spreadsheet.
*   **Don't use Harsh Gradients:** Gradients should only be used to mimic organic materials like wood or leather.
*   **Don't Over-complicate the Grid:** If a screen feels busy, increase the white space (linen background) rather than adding more containers.