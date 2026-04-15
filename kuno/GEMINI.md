# Kuno Project Memory

## Phase 1: Frontend UI Accomplishments

- **Design Language**: Sophisticated "Literary Sanctuary" palette (Sage Green, Dusty Rose, Slate Blue on Warm Linen).
- **Navigation**: Floating, centered navigation bar with persistent labels and active states.
- **Home Dashboard**:
    - **Current Journeys**: Redesigned as an overlapping, cascading stack of interactive cards for books currently being read.
    - **Whispers of Wisdom**: Replaced "Recent Additions" with a rotating section of 50 quotes about books and life.
    - Floating stats grid for quick library overview.
- **Bookshelf UI**:
    - **Enhanced Spines**: Taller (200px) and wider (64px) spines with `writing-mode: vertical-rl` to support multi-line vertical titles (no more head tilting or cut-off text).
    - **Standardized Icons**: Removed external cover fetching; all books use themed Phosphor icons matching their spine color for a uniform aesthetic.
    - **Shelf Sections**: Grouped by "Currently Reading", "Finished", "Unread", "Wishlist", and a hidden "Not for Me" (Archive).
- **Reading Journey Logic**:
    - **Status Transitions**: Implemented flow: Wishlist → Unread (Mark as Bought) → Currently Reading (Start Reading) → Finished (at 100% progress).
    - **Archive**: Added "Not for Me" section for books to be revisited later, with a "Give it another chance" option.
- **Profile & Personalization**:
    - **Books of Me**: A dedicated horizontal list view in the profile for finished books, ensuring easy readability.
    - **Avatar Selector**: Choose from 16 custom Phosphor icons (Cat, Dog, Rocket, etc.) for profile personalization.
    - **Smart Notifications**: Global notification toggle in Top Bar synchronized with Profile settings; added frequency options (4h, 8h, Daily).
- **Technical**:
    - Vite 8 + Tailwind CSS v3 + Framer Motion + Phosphor Icons.
    - Lifted notification state to `App.jsx` for cross-component synchronization.

## Phase 2: Backend & Firebase Storage Accomplishments

- **Firebase Integration**: Successfully connected Firebase Auth (Email/Password) and Firestore.
- **Offline-First Design**: Enabled `enableIndexedDbPersistence` for seamless offline usage and automatic synchronization.
- **Live Data Sync**: Transitioned from mock data to real-time Firestore synchronization using `onSnapshot`.
- **User Management**: Implemented secure Auth flow (Login/Register) with custom user profiles stored in Firestore.
- **Dynamic Stats**: Automated user reading stats (Total Read, Currently Reading, etc.) triggered by book status changes.
- **Smart Reminders**: Implemented 4-hour in-app reading reminders based on `lastReadSessionAt` logic.
- **Environment Safety**: Secured all Firebase credentials using `.env.local` with `VITE_` prefixing.

## Key Constants & Decisions
- **Project Name**: Kuno
- **Core Font**: Playfair Display (Headings), Inter (Body)
- **Primary Accent**: Sage Green (`#6B8F71`)
- **Move Logic**: Book movement follows a strict sequential journey (Buy -> Start -> Finish/Archive).
- **Icon Policy**: Pure iconography for all book covers to maintain UI consistency.
- **Persistence Policy**: Local-first with Firestore sync; UI prioritizes immediate local feedback.

## Phase 3: Android APK Build (Upcoming)
- Capacitor integration for Android.
- Native push notifications (4-hour reminders).
- Native Home Screen Widget (Kotlin).
- GitHub Push & Final APK generation.
