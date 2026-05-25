# WriteSpace — Local React Blog with Role-Based Access

**Type**: web_app
**Audience**: B2C

## Business Context
A fully holistic, single-page blog application that includes a public-facing landing page, role-based authentication, and complete content + user management. Two roles are supported — Admin and user — with all data persisted in localStorage. No backend, no encryption, no external auth library. Deployable as a static site on Vercel.

## Functional Requirements

### FR-001 — Public Landing Page
The public face of the app accessible without login at route `/`. Includes a public navbar, hero section, features section, latest posts preview, and footer. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Public Navbar shows 'WriteSpace' logo linking to `/`, and 'Login' and 'Get Started' buttons for guests
  - If logged in, navbar shows avatar chip + display name + 'Go to Dashboard' button (Admin goes to `/admin`, user goes to `/blogs`)
  - Navbar is sticky, white background with subtle shadow and bottom border
  - Hero section is full-viewport-height with gradient background `from-indigo-600 via-violet-600 to-pink-500`
  - Hero shows app name in large bold white text + tagline: 'Your thoughts. Your space. Beautifully simple.'
  - Two CTA buttons: 'Start Reading' (authenticated → `/blogs`, guests → `/login`) and 'Get Started Free' (→ `/register`)
  - CSS-only floating card animation hinting at blog UI (no JS animation libraries)
  - Features section has three colorful cards in responsive row (1-col mobile, 3-col desktop): 'Write Freely', 'Private & Local', 'Instant & Fast'
  - Latest Posts Preview heading 'Latest from the Blog' shows up to 3 most recent posts from `writespace_posts` in localStorage (title, excerpt, date)
  - Each preview card links to `/blog/:id`; unauthenticated clicks redirect to `/login`
  - If no posts: 'No posts yet — check back soon!'
  - Footer with links: Home, All Blogs, Login, Register; dark slate background with light text, copyright year

### FR-002 — Login Page
Entry point for all unauthenticated users at route `/login`. Authenticates against hard-coded admin credentials first, then localStorage users. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - Fields: Username (text), Password (password)
  - 'Login' primary button submits the form
  - 'Register' text link below routes to `/register`
  - On submit: check hard-coded admin first (`username === 'admin' && password === 'admin'`), then search `writespace_users` array in localStorage
  - On success: write `writespace_session` to localStorage; redirect Admin to `/admin`, user to `/blogs`
  - On failure: show inline error 'Invalid username or password.'
  - Already-authenticated users are redirected to their home (Admin → `/admin`, user → `/blogs`)
  - Full-viewport gradient background (`from-indigo-600 via-violet-600 to-pink-500`), centered white card with shadow, app logo at top

### FR-003 — Registration Page
Self-service sign-up page at route `/register`. All self-registered accounts are always `user` role. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - Fields: Display Name, Username, Password, Confirm Password
  - All fields required
  - Password and Confirm Password must match
  - Username must be unique across `writespace_users` and the hard-coded `admin`
  - On success: save to `writespace_users`, write session, redirect to `/blogs`
  - Link back to `/login`

### FR-004 — Authenticated Navbar
Persistent header on all authenticated pages (separate from public navbar). Shows role-based navigation links, avatar chip, and logout. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Left: Logo 'WriteSpace' linking to `/`
  - Center/Right nav links by role: Admin sees 'All Blogs', 'Write', 'Users'; user sees 'All Blogs', 'Write'
  - Active link highlighted with indigo background, rounded pill style
  - Far right: circular avatar chip (role-based color) + display name + dropdown with 'Logout'
  - Mobile: hamburger toggle using React state (no library)
  - Logout: clears `writespace_session` from localStorage, redirects to `/`

### FR-005 — Avatar System
Role-distinct visual avatars defined as static JSX. No image uploads. Admin gets crown emoji with `bg-violet-600` background; user gets book emoji with `bg-indigo-500` background. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: low | **Source**: original_prd
**Acceptance Criteria**:
  - Admin avatar: Crown emoji with `bg-violet-600` background
  - User avatar: Book emoji with `bg-indigo-500` background
  - Appears in: Navbar chip, User Management table, blog post author line
  - Exported as `getAvatar(role)` from `src/components/Avatar.jsx` returning JSX

### FR-006 — Blog List Page
Authenticated landing page at `/blogs` showing all posts in a responsive grid with ownership-based edit controls. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Responsive grid: 1 col mobile / 2 col tablet (`md:`) / 3 col desktop (`lg:`)
  - Each card shows: title, excerpt (first 120 chars), `createdAt` (formatted `MMM DD, YYYY`), author name + avatar
  - Colorful top border accent cycling from post index: indigo, violet, pink, teal (using `index % 4`)
  - Clicking card navigates to `/blog/:id`
  - Admin sees pencil Edit icon button on every card
  - User sees pencil Edit icon button only on cards where `authorId` matches session `userId`
  - Empty state: 'No blogs yet. Be the first to write one!' with Write CTA button
  - Posts sorted newest first

### FR-007 — Write / Edit Blog Page
Form for creating (`/write`) or updating (`/edit/:id`) posts. All authenticated users can create. Editing restricted by ownership: users can only edit own posts, Admin can edit any post. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Guests (not logged in) redirected to `/login`
  - Fields: Title (text input, full-width), Content (textarea, min height 256px, full-width)
  - Create mode (`/write`): available to ALL authenticated users; on save generate UUID, set `createdAt` + `authorId` + `authorName` from session, save to `writespace_posts`, redirect to `/blog/:id`
  - Edit mode (`/edit/:id`): pre-fill form; on save update record in localStorage, redirect to `/blog/:id`
  - Ownership check: if logged-in user is a user, they can only edit posts where `authorId` matches session `userId`; if a user tries to edit another user's post, redirect to `/blogs`; Admin can edit any post
  - Validation: both fields required; inline field-level error messages
  - Character counter below Content textarea
  - Cancel button (ghost style) routes back without saving

### FR-008 — Read Blog Page
Full reading view for a single post at `/blog/:id` with ownership-based edit/delete controls. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Displays: title (large heading), author avatar + display name (inline, small), `createdAt` date, full content (with `whitespace-pre-wrap` style)
  - Admin sees Edit and Delete buttons on ALL posts (top-right of card)
  - User sees Edit and Delete buttons ONLY on own posts (where `authorId` matches session `userId`); on other users' posts, user sees only 'Back to All Posts' button
  - Delete: `window.confirm(...)`, remove from `writespace_posts`, redirect to `/blogs`; ownership check applies (user can only delete own posts)
  - Invalid/missing ID: 'Post not found' message with back link

### FR-009 — Admin Dashboard
Admin-only overview page at `/admin` shown immediately after admin login. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Non-admins redirected to `/blogs`
  - Four colorful stat cards: Total Posts, Total Users, Total Admins, Total Users
  - Quick-action buttons: 'Write New Post' and 'Manage Users'
  - Recent Posts section: 5 most recent posts with inline Edit/Delete controls
  - Gradient banner header: `from-violet-600 to-indigo-600`

### FR-010 — User Management Panel
Admin page at `/users` to create and delete user accounts. [Pipeline-aligned]
**Priority**: must_have | **Complexity**: medium | **Source**: original_prd
**Acceptance Criteria**:
  - Non-admins redirected to `/blogs`
  - Responsive table (desktop) / stacked cards (mobile) with columns: avatar, display name, username, role badge pill, created date, Delete button
  - Create User form at top: Display Name, Username, Password, Role (dropdown: Admin/user); all fields required; username must be unique
  - On save: add to `writespace_users` with UUID + timestamp
  - Delete: `window.confirm(...)` before removal
  - Hard-coded `admin` Delete button: permanently disabled + tooltip 'Default admin cannot be deleted.'
  - Currently logged-in user cannot delete their own account

## Non-Functional Requirements

### NFR-001 — Performance
Near-instant route transitions with Vite HMR during development. All localStorage reads wrapped in try/catch with empty array fallback. [Pipeline-aligned]
**Target**: < 200ms route transitions

### NFR-002 — Reliability
Graceful empty state if localStorage is unavailable or corrupted. Direct URL access works on Vercel via vercel.json rewrites. [Pipeline-aligned]
**Target**: 100% of routes accessible via direct URL on Vercel

### NFR-003 — Simplicity
Shallow component tree. No over-engineering. Inline Tailwind utility classes only. No custom CSS beyond @tailwind directives in index.css. JavaScript (JSX) only, no TypeScript. [Pipeline-aligned]
**Target**: Zero .ts or .tsx files; zero custom CSS files beyond index.css

### NFR-004 — Security (MVP)
Passwords stored in plain text — documented in code comments. Route guards are client-side only. Acceptable for a local MVP with no sensitive data. No real passwords should be stored. [Pipeline-aligned]
**Target**: Plain text password storage documented with code comments

## Tech Stack
- **Frontend**: React 18+ with Vite and @vitejs/plugin-react [Pipeline-aligned]
- **Database**: localStorage (no real database) [Pipeline-aligned]
- **Infrastructure**: Vercel (static site deployment) [Pipeline-aligned]
- *Specified by user*: True

## In Scope
- Public landing page (no login required)
- Login and self-registration flows
- Role-aware redirects and route guards
- Avatar system (Admin vs User, role-distinct visuals)
- Authenticated blog list and full post reader
- Blog create for all authenticated users (Admin and user)
- Blog edit / delete with ownership rules (own posts for user, all posts for Admin)
- Admin dashboard with stats
- Admin user management (create / delete accounts)
- All data in localStorage (posts, users, session)
- Client-side routing via React Router v6
- Fully responsive Tailwind CSS UI
- vercel.json for SPA routing on Vercel

## Out of Scope
- Backend, REST API, or database
- Password hashing or encryption
- OAuth or third-party auth
- Rich text editor, image uploads
- Tags, categories, comments, likes
- Forgot password / email verification
- TypeScript (explicitly prohibited)
- Redux, Zustand, Jotai, or Context API
- Custom CSS files beyond index.css with @tailwind directives

## Assumptions
- Users will not store real passwords (plain text MVP demo)
- Browser supports crypto.randomUUID()
- Vercel deployment handles SPA routing via rewrites
- Single browser instance (no multi-tab sync concerns)
- All users have modern browsers supporting ES modules and Tailwind CSS

## Constraints
- Must use Vite+React JS (JavaScript JSX only, NO TypeScript)
- All React components must use .jsx extension, utilities may use .js
- Tailwind CSS exclusively via utility classes, no custom CSS files
- useState + useEffect hooks only, no Redux/Zustand/Jotai/Context API
- crypto.randomUUID() for all generated IDs
- No backend, no API calls, no encryption, no external auth library
- Exactly 1 epic with exactly 4 user stories
- Hard-coded admin account (admin/admin) must always exist and cannot be deleted
- vercel.json must contain ONLY rewrites, no build/install/output keys
- All data persisted in localStorage only

## Additional Context
## Project Structure

```
writespace/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── PublicNavbar.jsx
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── BlogCard.jsx
    │   ├── StatCard.jsx
    │   ├── UserRow.jsx
    │   └── Avatar.jsx
    ├── pages/
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── Home.jsx
    │   ├── ReadBlog.jsx
    │   ├── WriteBlog.jsx
    │   ├── AdminDashboard.jsx
    │   └── UserManagement.jsx
    └── utils/
        ├── storage.js
        └── auth.js
```

## Storage Schema

### `writespace_posts` — Array
```json
[
  {
    "id": "uuid-string",
    "title": "Post Title",
    "content": "Full post text...",
    "createdAt": "2026-03-04T12:00:00.000Z",
    "authorId": "uuid-or-hardcoded-admin",
    "authorName": "Admin"
  }
]
```

### `writespace_users` — Array
```json
[
  {
    "id": "uuid-string",
    "displayName": "Jane Doe",
    "username": "janedoe",
    "password": "plaintextpassword",
    "role": "user",
    "createdAt": "2026-03-04T12:00:00.000Z"
  }
]
```

### `writespace_session` — Object
```json
{
  "userId": "uuid-or-admin",
  "username": "admin",
  "displayName": "Admin",
  "role": "admin"
}
```

## Route Map & Access Control

| Route | Component | Admin | User | Guest |
|---|---|---|---|---|
| `/` | `LandingPage` | Yes (dashboard CTA) | Yes (dashboard CTA) | Yes |
| `/login` | `LoginPage` | Redirect to `/admin` | Redirect to `/blogs` | Yes |
| `/register` | `RegisterPage` | Redirect to `/admin` | Redirect to `/blogs` | Yes |
| `/blogs` | `Home` | Yes | Yes | Redirect to `/login` |
| `/blog/:id` | `ReadBlog` | Yes | Yes | Redirect to `/login` |
| `/write` | `WriteBlog` | Yes | Yes | Redirect to `/login` |
| `/edit/:id` | `WriteBlog` | Yes (any post) | Yes (own posts only) | Redirect to `/login` |
| `/admin` | `AdminDashboard` | Yes | Redirect to `/blogs` | Redirect to `/login` |
| `/users` | `UserManagement` | Yes | Redirect to `/blogs` | Redirect to `/login` |

A `<ProtectedRoute />` wrapper handles guest-to-login redirection. A `<ProtectedRoute role="admin" />` variant additionally checks for admin role and redirects non-admins to `/blogs`. Ownership checks for edit/delete are handled within the `WriteBlog` and `ReadBlog` components themselves.

## UI / Design System (Tailwind CSS)

### Color Palette
| Token | Tailwind Class | Usage |
|---|---|---|
| Indigo 600 | `bg-indigo-600` / `text-indigo-600` | Primary brand, buttons, links |
| Violet 600 | `bg-violet-600` / `text-violet-600` | Admin accent, admin avatar |
| Pink 500 | `bg-pink-500` | Card accents, gradient stops |
| Teal 500 | `bg-teal-500` | Card accents, stat cards |
| Slate 50 | `bg-slate-50` | App body background |
| White | `bg-white` | Content cards |
| Slate 800 | `text-slate-800` | Body text |
| Slate 500 | `text-slate-500` | Dates, metadata |
| Red 600 | `text-red-600 bg-red-50` | Destructive actions |

### Gradients
- Auth pages (Login / Register): `bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500`
- Landing hero: same gradient
- Admin Dashboard header: `bg-gradient-to-r from-violet-600 to-indigo-600`
- Navbar: `bg-white shadow-sm border-b border-slate-100`

### Button System
| Type | Tailwind Classes |
|---|---|
| Primary (Save) | `bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none transition-all` |
| Secondary (Edit) | `bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none` |
| Destructive (Delete) | `bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none` |
| Ghost (Cancel) | `text-slate-500 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none` |

### Role Badge Pills
- Admin: `bg-violet-100 text-violet-700 ring-1 ring-violet-300 rounded-full px-3 py-0.5 text-sm font-medium`
- User: `bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300 rounded-full px-3 py-0.5 text-sm font-medium`

### Blog Card Accent Borders (deterministic by index)
- Index 0: `border-t-4 border-indigo-500`
- Index 1: `border-t-4 border-violet-500`
- Index 2: `border-t-4 border-pink-500`
- Index 3: `border-t-4 border-teal-500`
- Cycle repeats using `index % 4`.

### Responsive Breakpoints
| Breakpoint | Behavior |
|---|---|
| `< 640px` | Stacked layout, hamburger nav, single-col grid, table becomes stacked cards |
| `md: 768px+` | 2-col blog grid, side-by-side form buttons |
| `lg: 1024px+` | 3-col blog grid, `max-w-6xl mx-auto` containers |

## Config Files (Exact Contents)

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WriteSpace</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### `src/main.jsx`
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

## File Responsibilities
- **`main.jsx`**: React entry point. Imports React, ReactDOM, BrowserRouter, App, and index.css. Calls `ReactDOM.createRoot(document.getElementById('root')).render(...)`. Wraps `<App />` in `<BrowserRouter>`. Do NOT import App.css.
- **`App.jsx`**: Root component. Defines all `<Route>` entries using React Router v6 `<Routes>`. Wraps protected routes in `<ProtectedRoute>`. Conditionally renders `<PublicNavbar>` or `<Navbar>` based on session state from `auth.js`.
- **`index.css`**: Contains ONLY the three `@tailwind` directives.
- **`PublicNavbar.jsx`**: Guest navigation bar. Shows 'WriteSpace' logo, 'Login' and 'Get Started' buttons. If logged in, shows avatar chip + 'Go to Dashboard' button.
- **`Navbar.jsx`**: Authenticated navigation bar. Role-based nav links, avatar chip with display name and logout dropdown. Mobile hamburger toggle.
- **`ProtectedRoute.jsx`**: Route guard. Checks `writespace_session` in localStorage. Redirects guests to `/login`. If `role` prop is `"admin"` and user is user, redirects to `/blogs`.
- **`BlogCard.jsx`**: Reusable post card. Title, excerpt (120 chars), date, author avatar. Colorful top border cycling by index. Edit icon based on role/ownership.
- **`StatCard.jsx`**: Reusable admin dashboard stat tile. Number + label with colorful icon background.
- **`UserRow.jsx`**: User table row (desktop) or stacked card (mobile). Avatar, display name, username, role badge, created date, delete button.
- **`Avatar.jsx`**: Exports `getAvatar(role)` returning styled JSX `<span>` with emoji + role color Tailwind classes.
- **`LandingPage.jsx`**: Public landing page. Hero, features, latest posts preview, footer.
- **`LoginPage.jsx`**: Login form. Checks hard-coded admin first, then localStorage users. Writes session on success.
- **`RegisterPage.jsx`**: Registration form. Creates user account. Validates fields, checks username uniqueness.
- **`Home.jsx`**: Authenticated blog list at `/blogs`. Responsive grid of BlogCard components. Empty state.
- **`ReadBlog.jsx`**: Full post reader at `/blog/:id`. Title, author, date, content. Edit/delete based on ownership/role.
- **`WriteBlog.jsx`**: Blog create (`/write`) and edit (`/edit/:id`) form. Ownership enforcement for editing.
- **`AdminDashboard.jsx`**: Admin overview at `/admin`. Gradient header, stat cards, quick actions, recent posts.
- **`UserManagement.jsx`**: Admin user management at `/users`. Create user form, user table/cards, delete with confirmation. Hard-coded admin cannot be deleted.
- **`storage.js`**: localStorage helpers. Exports: `getPosts()`, `savePosts(arr)`, `getUsers()`, `saveUsers(arr)`. All reads wrapped in try/catch with fallback to `[]`.
- **`auth.js`**: Session helpers. Exports: `getSession()`, `setSession(obj)`, `clearSession()`. Reads/writes `writespace_session` in localStorage.

## Risks
- Using TypeScript instead of JavaScript — ALL files must be `.jsx`, NEVER `.ts` or `.tsx`.
- Forgetting to include `@vitejs/plugin-react` in `vite.config.js`.
- Forgetting to create `tailwind.config.js` with the correct `content` paths.
- Forgetting to create `postcss.config.js` with `tailwindcss` and `autoprefixer` plugins.
- Forgetting to create `src/index.css` with the three `@tailwind` directives.
- Adding extra keys (`builds`, `buildCommand`, `outputDirectory`, `installCommand`, `framework`) to `vercel.json` — use ONLY `rewrites`.
- Circular component imports.
- Forgetting to wrap `<App />` in `<BrowserRouter>` inside `main.jsx`.
- Forgetting to create `main.jsx` with `ReactDOM.createRoot(document.getElementById('root')).render(...)`.
- Using CSS files or CSS modules instead of Tailwind utility classes.

## Epic & User Stories
### Epic: WriteSpace — Landing, Auth, Roles & Content Management
**Goal:** A fully holistic, role-aware blog app with a public landing page, complete authentication, blog CRUD for all authenticated users (with ownership-based access control), admin dashboard, and user management. No backend. No encryption. localStorage only.
**Constraints:** Exactly 1 epic. Exactly 4 user stories. Every route, component, and requirement maps to one story.