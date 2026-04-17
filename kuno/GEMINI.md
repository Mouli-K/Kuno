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

## Phase 3: Android APK Build (Completed)
- Capacitor integration for Android successfully configured.
- Native push notifications (4-hour reminders) implemented via `@capacitor/local-notifications`.
- Implemented "Double-tap to Exit" global navigation logic with animated toast.
- Automated build process for Android APK verified and successful.
- Git repository initialized and pushed to GitHub (main branch).

## Phase 4: UX Refinement & Achievement System (Completed)
- **Centered Modal UX**: Replaced bottom drawer with a centered, more focused `BookDetailModal` for better ergonomics on all screens.
- **Milestone & Alerts**: 
    - Implemented `createNotification` system for milestones (50, 100 pages).
    - Added "Give it another chance" logic to restore archived books to "Reading".
    - Added "Read again" functionality for finished books.
- **Home Dashboard Evolution**: 
    - Added **Milestones** horizontal scroll section to track achievements (Centurion, Consistent Reader, etc.).
    - Enhanced stats grid with **Day Streak** and **Max Pages** read metrics.
- **Data Synchronization**:
    - Implemented **Pull-to-Refresh** gesture on Home and Shelf pages for manual library re-sync.
    - Added manual refresh buttons (ArrowsClockwise) to top headers.
- **Robust Navigation**: 
    - Fixed "Blank Screen" issue in `BookDetailModal` by adding null-safety guards for book data and forcing re-mounts via `key` props.
    - Optimized `AddBookDrawer` to auto-close and reset state immediately upon successful book addition.
- **Widget Deprecation**: Completely removed native Android widget code and synchronization logic to focus on core app stability.

## Phase 5: Reliability & Live Sync (Completed)
- **Live Progress Updates**: Fixed `BookDetailModal` to synchronize internal `pagesRead` state with real-time Firestore updates, ensuring immediate UI feedback without re-opening.
- **Smart Reminders**: Refined `useReminder` to correctly handle the 4-hour interval preference for native push notifications.
- **Streak & Summary Persistence**:
    - Implemented `useStreak` hook to automatically calculate and update daily reading streaks on app launch.
    - Fixed `userData` context bug in `BookDetailModal` that prevented global stats (Max Pages, etc.) from updating correctly.
- **Widget Refinement**:
    - Synchronized `updateWidget` to use multi-book JSON format for the Android widget.
    - Optimized widget to display up to 2 active books simultaneously (Static display optimized for stability).
- **Navigation Safety**: Enhanced `App.jsx` with unique `key` props for the global modal to prevent state stale-ness across different books.

## Key Constants & Decisions
- **Project Name**: Kuno
- **Core Font**: Playfair Display (Headings), Inter (Body)
- **Primary Accent**: Sage Green (`#6B8F71`)
- **Move Logic**: Book movement follows a strict sequential journey (Buy -> Start -> Finish/Archive).
- **Icon Policy**: Pure iconography for all book covers and app icon (Sage Green book design).
- **Persistence Policy**: Local-first with Firestore sync; UI prioritizes immediate local feedback.
- **Mobile Platform**: Android (via Capacitor 8.3.0, Java bridge).
- **Navigation UX**: Double-tap back button to exit app from any tab.
