
## KUNO - Personal Tracker

### PROJECT OVERVIEW

You are building **Kuno**, a personal books tracking mobile application for Android. This is a long-term personal app that will grow with new modules over time. The first module is a books tracker. The architecture follows a **local-first, Firebase-backed** design. Build this **phase by phase** — do NOT rush into a full build. Each phase must be complete, polished, and confirmed before moving to the next.

The name is **Kuno**. Keep this name consistently across all screens, metadata, app title, and branding.

---

### CONFIRMED TECHNICAL DECISIONS

- **Frontend**: React + Vite (`npm create vite@latest kuno -- --template react`)
- **Styling**: TailwindCSS v3
- **Animations**: Framer Motion
- **Book Spine Rendering**: CSS-based spines with SVG shelf accents (NO full SVG rendering for spines — use styled divs)
- **Icon Library**: `@phosphor-icons/react` — install via npm, bundled into the build, fully offline in APK. Do NOT use any CDN icon service.
- **Dark Mode**: Yes — implement from day one. Use Tailwind's `dark:` class system with a toggle. Warm dark palette (deep charcoal-brown, not cold black).
- **Git Repository**: `https://github.com/Mouli-K/Kuno.git`
- **Android**: Capacitor (Phase 3 only)

---

### DESIGN LANGUAGE & TONE

- **Soft, warm, cozy aesthetic** — warm off-whites, muted earthy tones, soft amber, dusty rose, sage green. Think a personal reading nook at golden hour.
- **No harsh whites or cold blacks.** Use warm neutrals. Background should feel like aged paper or warm linen, never clinical white.
- **Dark mode**: Deep warm charcoal (`#1C1A17`), not cold dark grey. Accents stay warm.
- **Typography**: Use `font-family: 'Playfair Display', serif` for headings (import from Google Fonts in Vite). Body text: `'Inter', sans-serif`.
- **Bookshelf UI** — books rendered as CSS spines on a shelf, NOT list rows. Each spine is a styled vertical div with color, title text rotated 90°, and a genre dot. Clicking opens a detail modal.
- I will share my Stitch folder color reference separately. When I do, extract the hex values and apply them as your primary palette. Until then, use these warm defaults:

```
--warm-bg: #FAF7F2
--warm-surface: #F2EDE4
--warm-border: #E0D5C5
--warm-text: #2C2416
--warm-muted: #8B7355
--warm-accent: #C17F4A
--warm-accent-soft: #F0DFC8
--warm-green: #6B8F71
--warm-rose: #C17979
--warm-blue: #6B85A0
--dark-bg: #1C1A17
--dark-surface: #252219
--dark-border: #3A3527
--dark-text: #F0EAE0
--dark-muted: #9A8E78
```

---

### ⚠️ PHASE RULES — MANDATORY

- Work strictly **one phase at a time**.
- Do NOT write backend code in Phase 1.
- Do NOT write Android build config in Phase 1 or 2.
- After completing each phase, output exactly: *"✅ Phase [N] complete. Please review and confirm before I begin Phase [N+1]."*
- Each phase must be **fully functional and bug-free** in its own scope before continuation.
- If you are unsure about any decision not covered here, **ask me first**.

---

## PHASE 1 — FRONTEND UI (Localhost Web Preview)

**Goal**: A fully interactive, visually polished React + Vite web app running on `localhost:5173`. No real backend. All data is mocked. I will visually review and approve the UI before any backend work.

### Project Setup Commands
```bash
npm create vite@latest kuno -- --template react
cd kuno
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion
npm install @phosphor-icons/react
npm install react-router-dom
```

Configure Tailwind to scan `./src/**/*.{js,jsx}`. Add the warm color palette to `tailwind.config.js` as custom colors under `theme.extend.colors`.

### File Structure to Follow
```
src/
  components/
    bookshelf/
      BookSpine.jsx
      ShelfRow.jsx
      ShelfSection.jsx
    modals/
      BookDetailModal.jsx
      AddBookDrawer.jsx
    ui/
      StatusBadge.jsx
      ProgressBar.jsx
      GenreChip.jsx
      AmazonButton.jsx
      FlipkartButton.jsx
      NotificationBell.jsx
      ThemeToggle.jsx
    layout/
      BottomNav.jsx
      TopBar.jsx
  pages/
    Splash.jsx
    Login.jsx
    Register.jsx
    Home.jsx
    Shelf.jsx
    AddBook.jsx
    Profile.jsx
    Notifications.jsx
  data/
    mockBooks.js
    mockUser.js
  hooks/
    useTheme.js
    useBooks.js
  utils/
    colors.js
    googleBooks.js
  App.jsx
  main.jsx
  index.css
```

---

### SCREENS

**1. Splash Screen** (`/splash`)
- Kuno wordmark centered — use Playfair Display, warm accent color
- Tagline: *"Your shelf, your story."*
- Soft animated fade-in on load (Framer Motion)
- Auto-redirects to Login after 2 seconds

**2. Login Screen** (`/login`)
- Warm linen background with subtle texture (CSS pattern, no image)
- Kuno logo at top
- Email + password fields — styled with warm border, rounded corners
- "Sign In" button — warm accent fill
- "Don't have an account? Register" link below
- "Forgot password?" link (UI only in Phase 1)
- Inline validation: empty field highlight, invalid email format message
- Phosphor icons for field icons: `Envelope`, `Lock`

**3. Register Screen** (`/register`)
- Same warm design as Login
- Fields: Display Name, Email, Password, Confirm Password
- Phosphor icons: `User`, `Envelope`, `Lock`, `LockKey`

**4. Home / Dashboard** (`/home`)
- Top bar: "Good morning, [Name] ☀️" — time-aware greeting
- Dark mode toggle (sun/moon Phosphor icon, top right)
- Notification bell with unread badge
- Stats row — 4 metric cards in a 2×2 grid (warm surface cards):
  - 📚 Total Books | 🔖 Reading | ✅ Finished | 🛒 Wishlist
- "Continue Reading" hero card:
  - Book spine color as left border accent
  - Title, author
  - Custom ProgressBar component (warm bookmark-fill style — NOT a plain HTML progress bar. Design it as a illustrated warm bar with a small open-book icon at the fill edge)
  - "Open" button
- "Recently Added" horizontal scroll — 4–5 mini spine cards

**5. Shelf Screen — HIGHEST PRIORITY** (`/shelf`)

This is the hero screen. It must look stunning.

- Top: Filter chips row (horizontal scroll):
  - `All` `Currently Reading` `Already Read` `Bought, Not Started` `Want to Buy`
  - Below that: Genre filter chips (Fiction, Non-Fiction, etc.)
  - Chips: soft pill style, warm accent when selected, animated selection (Framer Motion layout animation)

- Main area: **The Bookshelf**
  - Warm wooden shelf background: CSS `linear-gradient` to simulate wood grain — warm browns, not realistic photo
  - Each shelf row has a bottom "shelf plank" — a CSS div with warm brown gradient and subtle shadow above it
  - Books sit ON the plank, aligned to the bottom of the row

- **`BookSpine` component** (CSS only):
  ```
  - Width: 32–48px (based on title length, min 32px)
  - Height: 160px
  - Background: book's assigned hex color
  - Border-radius: 2px on right, 0 on left (spine binding side)
  - Left border: 3px darker shade of spine color (binding effect)
  - Title text: rotated 90deg, bottom-to-top, white or dark depending on spine color contrast
  - Font: Playfair Display, 10px, truncated at ~20 chars
  - Genre dot: small 6px circle at top center of spine
  - Hover: slight scale-up (1.05) + translateY(-8px) + warm drop shadow (Framer Motion whileHover)
  - Cursor: pointer
  ```
  - Books lean slightly (2–3deg tilt) — alternate left/right randomly per shelf for a natural lived-in look
  - Add a few CSS-only decorative items on shelves: a small plant pot, a bookmark ribbon — just to break up the uniformity

- Shelves are grouped by **reading status**:
  - Section header: "📖 Currently Reading", "✅ Already Read", etc. — warm muted label
  - Each section is a `ShelfSection` with 1–2 `ShelfRow` components inside

- Clicking a spine → `BookDetailModal` opens (animated scale + fade from the spine's position using Framer Motion `layoutId`)

**`BookDetailModal`**:
- Bottom sheet on mobile (slides up), centered modal on wider screens
- Left strip: book's spine color as full-height colored band
- Book cover: if URL available show image; otherwise show colored block with title initial in large Playfair Display
- Title (Playfair Display, 22px), Author (Inter muted, 14px)
- Genre + Category badges (GenreChip components)
- Description (truncated to 3 lines, "Read more" expander)
- Status badge (StatusBadge component — color coded per state)
- **ProgressBar** (only for "Currently Reading"):
  - Show "Page X of Y · Z% complete"
  - Warm illustrated bar — use a CSS gradient fill with a small SVG open-book icon at the progress head
  - Tap to edit progress inline
- **For "Want to Buy"**:
  - Price display with ₹ symbol
  - `AmazonButton` — black background, white "a" smile logo (SVG), "Buy on Amazon" text
  - `FlipkartButton` — #F3AE02 background, Flipkart bag SVG icon, "Buy on Flipkart" text
  - Both buttons open the link in a new tab
- Rating: 5 tappable star icons (Phosphor `Star` / `StarFill`)
- Notes: expandable textarea
- Date started / finished: date pickers
- Bottom action row: "Edit" (Phosphor `PencilSimple`) | "Delete" (Phosphor `Trash`) | "Close" (Phosphor `X`)

**6. Add Book Drawer** (`AddBookDrawer`)
- Bottom sheet that slides up (Framer Motion `y` animation)
- Top handle bar (drag to dismiss)
- Search bar at top: "Search for a book..."
  - On input change (debounced 400ms), call Google Books API:
    `https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=8`
  - Show results as cards: thumbnail + title + author
  - When user selects a result: auto-fill all fields
  - Extract dominant color from book cover thumbnail using a small canvas sampling function (in `utils/colors.js`) — assign as `spineColor`
  - If color extraction fails, show 8 warm color swatches for user to pick

- Form fields:
  - Status (custom styled dropdown, not native select): Currently Reading / Already Read / Bought Not Started / Want to Buy
  - Category (same custom dropdown): Fiction / Non-Fiction / Self-Help / Science / History / Philosophy / Technology / Art / Biography / Other
  - Genre (auto from API or text input)
  - Rating (star tap selector)
  - Pages Read + Total Pages (shown only when "Currently Reading")
  - Price in ₹ + Platform toggle (Amazon / Flipkart) + URL field (shown only when "Want to Buy")
  - Notes (textarea)
  - Date Started (shown for "Currently Reading" and "Already Read")
  - Date Finished (shown for "Already Read")

- "Add to Shelf" CTA button — warm accent, full width, Phosphor `BookmarkSimple` icon

**7. Profile Screen** (`/profile`)
- Avatar: initials in a warm circle (e.g., "MK")
- Name + email
- Reading stats: Books read this year | Avg rating | Fav genre
- Notification preferences: toggle for 4-hour reminders
- Dark mode toggle (mirrored from top bar)
- "Sign Out" button (Phosphor `SignOut` icon)

**8. Notifications Screen** (`/notifications`)
- List of notification cards
- Each card: icon (Phosphor `BookOpen`), message, timestamp, unread dot
- "Mark all read" action
- Empty state: Phosphor `BellSimple` illustration, "You're all caught up!" message

---

### MOCK DATA

Create `src/data/mockBooks.js` with at least 12 books spread across all 4 statuses and multiple genres. Include realistic titles, authors, spine colors (warm hex values), progress data, prices, and purchase links. Make the shelf look full and varied.

Include at least:
- 3 books in "Currently Reading" (different progress levels)
- 4 books in "Already Read" (with ratings)
- 2 books in "Bought, Not Started"
- 3 books in "Want to Buy" (with prices, one Amazon link, one Flipkart link)

---

### EMPTY STATES

Design warm, friendly empty states for:
- Empty shelf section: Phosphor `Books` icon, "Your [section] shelf is empty. Add your first book!"
- No search results: Phosphor `MagnifyingGlass`, "No books found. Try a different title."
- No notifications: Phosphor `BellSimple`, "All caught up!"

---

### DELIVERABLE FOR PHASE 1
- Running on `localhost:5173` with `npm run dev`
- All 8 screens navigable via React Router
- Bookshelf renders with CSS spines and shelf planks
- Book Detail Modal opens with Framer Motion animation
- Add Book Drawer opens with Google Books API live search
- Dark mode toggles correctly across all screens
- All Phosphor icons working (from npm, offline)
- Zero console errors
- `README.md` with setup instructions

Output: *"✅ Phase 1 complete. Please review and confirm before I begin Phase 2."*

---

## PHASE 2 — BACKEND & FIREBASE STORAGE

**Goal**: Replace mock data with live Firebase. Implement auth, Firestore, and local-first offline sync.

> ⚠️ I will provide the Firebase config object (API keys) in a separate message when Phase 1 is approved. Store them in `.env` using `VITE_` prefix. Never hardcode credentials.

### Install
```bash
npm install firebase
```

### Firebase Services
- **Firebase Auth** — email/password only
- **Firestore** — with `enableIndexedDbPersistence` for offline-first
- **Firebase Storage** — scaffold only (future use)

### Firestore Collections

**`users/{userId}`**
```json
{
  "uid": "string",
  "displayName": "string",
  "email": "string",
  "createdAt": "timestamp",
  "preferences": {
    "notificationsEnabled": true,
    "readingReminderIntervalHours": 4,
    "theme": "light"
  },
  "stats": {
    "totalRead": 0,
    "currentlyReading": 0,
    "wantToBuy": 0,
    "boughtNotStarted": 0
  }
}
```

**`users/{userId}/books/{bookId}`**
```json
{
  "bookId": "string",
  "title": "string",
  "author": "string",
  "description": "string",
  "genre": "string",
  "category": "string",
  "coverUrl": "string",
  "spineColor": "#C17F4A",
  "status": "reading | read | bought_not_started | want_to_buy",
  "rating": 0,
  "progress": {
    "pagesRead": 0,
    "totalPages": 0,
    "percentComplete": 0
  },
  "price": null,
  "purchasePlatform": "amazon | flipkart | null",
  "purchaseLink": null,
  "notes": "",
  "dateStarted": null,
  "dateFinished": null,
  "dateAdded": "timestamp",
  "lastUpdated": "timestamp",
  "googleBooksId": null
}
```

**`users/{userId}/notifications/{notificationId}`**
```json
{
  "type": "reading_reminder | milestone | custom",
  "message": "string",
  "bookId": null,
  "isRead": false,
  "createdAt": "timestamp"
}
```

### Local-First Setup
- Enable `enableIndexedDbPersistence` on Firestore init
- All reads: prefer local cache, sync from server in background
- All writes: write to local cache immediately, sync when online
- Show a subtle "Offline — changes will sync when connected" warm toast banner when `navigator.onLine === false`
- Use `onSnapshot` listeners for real-time updates

### Auth Flow
- Register → `createUserWithEmailAndPassword` → create `users/{uid}` doc → redirect to Home
- Login → `signInWithEmailAndPassword` → load user doc → redirect to Home
- Logout → `signOut` → clear local state → redirect to Login
- Wrap entire app in `AuthContext` provider
- Protected routes: redirect to `/login` if no authenticated user

### 4-Hour In-App Notification Logic
- On every app load: read `lastReadSessionAt` from `users/{uid}` Firestore doc
- If `Date.now() - lastReadSessionAt > 4 * 60 * 60 * 1000`: create a new doc in `notifications` collection + show in-app banner
- When user opens a book detail modal: update `lastReadSessionAt` to `Date.now()`
- Notification message rotates from a list of warm, personal messages:
  - "Hey [Name], your books miss you. Time to read for a bit? 📖"
  - "It's been a while! Even 10 pages count. ✨"
  - "Your shelf is waiting. Pick up where you left off."

Output: *"✅ Phase 2 complete. Firebase is wired and offline sync is active. Please test and confirm before I begin Phase 3."*

---

## PHASE 3 — ANDROID APK BUILD (Capacitor + Git Push)

**Goal**: Convert the web app to a native Android APK using Capacitor. Add native push notifications and a home screen widget. Push to GitHub.

### Capacitor Setup
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npm install @capacitor/local-notifications
npx cap init Kuno com.kuno.booktracker --web-dir dist
npx cap add android
npm run build
npx cap sync
```

`capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.kuno.booktracker',
  appName: 'Kuno',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_kuno_notification',
      iconColor: '#C17F4A',
    }
  }
};
export default config;
```

### Local Notifications (4-hour reminder)
- Use `@capacitor/local-notifications`
- On app launch: check permission → request if not granted
- Schedule repeating notification:
  ```
  Title: "Time to read, [Name] 📖"
  Body: "You're on page X of [current book title]. Keep going!"
  Every: 4 hours
  ```
- Notification tap → deep link to currently reading book in app
- Respect user's notification toggle from Profile settings (cancel schedule if disabled)

### Home Screen Widget
- Implement as a native Android `AppWidgetProvider` in Kotlin inside `android/app/src/main/java/com/kuno/booktracker/`
- Widget layout (`res/layout/kuno_widget.xml`):
  - Warm background (`#FAF7F2` light / `#1C1A17` dark)
  - Small "Kuno" wordmark top left (Playfair Display — use custom font in widget via XML)
  - Book spine color strip (left edge, 6dp wide, book's `spineColor`)
  - Book title (truncated, 14sp)
  - Author (12sp, muted)
  - Custom progress bar (warm gradient fill, matches app style)
  - "X% complete" label
  - Tap → opens app to that book's detail screen
- Widget updates when user changes reading progress in app (use `AppWidgetManager.updateAppWidget`)
- Pass data from Capacitor to widget via `SharedPreferences`

### APK Build
```bash
cd android
./gradlew assembleDebug
```
APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

Also provide instructions for generating a signed release APK for personal sideloading.

### Git Push
```bash
git init
git remote add origin https://github.com/Mouli-K/Kuno.git
```

`.gitignore` must include:
```
node_modules/
dist/
android/
.env
.env.local
*.local
.DS_Store
```

Commit message: `feat: Kuno v1.0 — books tracker with Firebase, local-first sync, Android APK`

```bash
git add .
git commit -m "feat: Kuno v1.0 — books tracker with Firebase, local-first sync, Android APK"
git branch -M main
git push -u origin main
```

`README.md` must include:
- Project overview and Kuno description
- Tech stack
- Local dev setup (`npm install`, `npm run dev`)
- Firebase setup instructions (where to add config)
- Android build steps
- Firestore collection structure
- Phase roadmap

Output: *"✅ Phase 3 complete. APK built. Code pushed to https://github.com/Mouli-K/Kuno.git. Kuno is live."*

---

### GLOBAL RULES (All Phases)

1. Never use placeholder lorem ipsum — all copy must feel personal and warm.
2. The bookshelf is the hero of the app — it must look beautiful every time.
3. Every book must have a color. Extract from cover or fallback to warm swatches.
4. Amazon and Flipkart buttons must use proper brand SVG icons (inline SVG in JSX — no CDN).
5. All icons are from `@phosphor-icons/react` — npm installed, bundled, offline.
6. All API keys in `.env` with `VITE_` prefix. Never hardcoded anywhere.
7. Error states and empty states must be designed — no blank white screens.
8. Dark mode must work on all screens from Phase 1 onward.
9. Code must be clean: well-named components, no dead code, no `console.log` in production.
10. Ask before making any architectural decision not covered in this prompt.
11. `@phosphor-icons/react` is already in the npm bundle — it will be in the Android APK automatically. Do not use any web-font or CDN icon service.

---

That's the complete, final version. When you paste this into Gemini, start a fresh chat and paste it all at once. The moment it finishes reading, it should ask you to confirm the color palette from your Stitch folder before touching any code — and then it will begin Phase 1 only.