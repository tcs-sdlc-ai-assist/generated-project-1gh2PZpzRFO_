# Implementation Tasks

<!-- nexus-tasks-version: 1 -->

## TASK-001 — Project scaffolding and configuration

```nexus-task
{
  "task_id": "TASK-001",
  "title": "Project scaffolding and configuration",
  "status": "in_progress",
  "depends_on": [],
  "target_files": [
    "package.json",
    "vite.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "index.html",
    "vercel.json"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Create the Vite + React project scaffold: package.json with all dependencies (react, react-dom, react-router-dom, tailwindcss, postcss, autoprefixer, vite, @vitejs/plugin-react), vite.config.js, tailwind.config.js, postcss.config.js, index.html entry point, and vercel.json for static deployment.

**Acceptance:**
- [ ] package.json includes react ^18.2.0, react-dom ^18.2.0, react-router-dom ^6.20.0, tailwindcss ^3.4.0, postcss ^8.4.32, autoprefixer ^10.4.16, vite ^5.0.0, @vitejs/plugin-react ^4.2.0
- [ ] vite.config.js configures @vitejs/plugin-react plugin
- [ ] tailwind.config.js sets content paths to ['./index.html', './src/**/*.{js,jsx}']
- [ ] postcss.config.js registers tailwindcss and autoprefixer plugins
- [ ] index.html has a div#root mount point and script src=/src/main.jsx
- [ ] vercel.json rewrites all routes to /index.html for SPA support

---

## TASK-002 — Entry point and global styles

```nexus-task
{
  "task_id": "TASK-002",
  "title": "Entry point and global styles",
  "status": "in_progress",
  "depends_on": [
    "TASK-001"
  ],
  "target_files": [
    "src/main.jsx",
    "src/index.css"
  ],
  "estimated_complexity": 1,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/main.jsx (React root mount with BrowserRouter) and src/index.css (Tailwind directives @tailwind base/components/utilities plus any global body styles).

**Acceptance:**
- [ ] src/main.jsx renders <App /> wrapped in <BrowserRouter> into #root
- [ ] src/index.css contains @tailwind base, @tailwind components, @tailwind utilities directives
- [ ] src/index.css sets body margin 0, font-family sans-serif

---

## TASK-003 — Utility modules: storage.js and auth.js

```nexus-task
{
  "task_id": "TASK-003",
  "title": "Utility modules: storage.js and auth.js",
  "status": "in_progress",
  "depends_on": [
    "TASK-001"
  ],
  "target_files": [
    "src/utils/storage.js",
    "src/utils/auth.js"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/utils/storage.js with CRUD helpers for writespace_posts and writespace_users (getPosts, savePost, updatePost, deletePost, getUsers, saveUser, deleteUser) and src/utils/auth.js with getSession, setSession, clearSession for writespace_session. All reads wrapped in try/catch with empty array/null fallback.

**Acceptance:**
- [ ] storage.js exports getPosts, savePost, updatePost, deletePost, getUsers, saveUser, deleteUser
- [ ] auth.js exports getSession, setSession, clearSession
- [ ] All localStorage reads wrapped in try/catch with [] or null fallback
- [ ] getSession returns null when no session exists
- [ ] savePost generates id via crypto.randomUUID() and sets createdAt to ISO string

---

## TASK-004 — Avatar component

```nexus-task
{
  "task_id": "TASK-004",
  "title": "Avatar component",
  "status": "in_progress",
  "depends_on": [
    "TASK-002"
  ],
  "target_files": [
    "src/components/Avatar.jsx"
  ],
  "estimated_complexity": 1,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/components/Avatar.jsx exporting getAvatar(role) that returns JSX: Admin gets crown emoji with bg-violet-600, user gets book emoji with bg-indigo-500. Both are circular (rounded-full) with white text.

**Acceptance:**
- [ ] getAvatar('admin') returns JSX with crown emoji and bg-violet-600
- [ ] getAvatar('user') returns JSX with book emoji and bg-indigo-500
- [ ] Avatar is a circular div with rounded-full, w-10 h-10, flex items-center justify-center

---

## TASK-005 — ProtectedRoute component

```nexus-task
{
  "task_id": "TASK-005",
  "title": "ProtectedRoute component",
  "status": "in_progress",
  "depends_on": [
    "TASK-003"
  ],
  "target_files": [
    "src/components/ProtectedRoute.jsx"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/components/ProtectedRoute.jsx that reads session from getSession(). If no session, redirects to /login. If role prop is 'admin' and session.role !== 'admin', redirects user to /blogs. Otherwise renders children.

**Acceptance:**
- [ ] Guest users (no session) redirected to /login via <Navigate>
- [ ] Non-admin users on admin-only routes redirected to /blogs
- [ ] Authenticated users with correct role see children content
- [ ] Uses getSession() from auth.js

---

## TASK-006 — PublicNavbar component

```nexus-task
{
  "task_id": "TASK-006",
  "title": "PublicNavbar component",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-004"
  ],
  "target_files": [
    "src/components/PublicNavbar.jsx"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/components/PublicNavbar.jsx: sticky white navbar with shadow, bottom border. Shows 'WriteSpace' logo linking to /. If guest: 'Login' and 'Get Started' buttons. If logged in: avatar chip + display name + 'Go to Dashboard' button (Admin→/admin, user→/blogs).

**Acceptance:**
- [ ] Sticky top-0, bg-white, shadow-sm, border-b
- [ ] Logo 'WriteSpace' links to /
- [ ] Guest sees 'Login' (→/login) and 'Get Started' (→/register) buttons
- [ ] Logged-in user sees avatar chip + displayName + 'Go to Dashboard' (Admin→/admin, user→/blogs)
- [ ] Uses getAvatar(role) from Avatar.jsx

---

## TASK-007 — Footer component

```nexus-task
{
  "task_id": "TASK-007",
  "title": "Footer component",
  "status": "in_progress",
  "depends_on": [
    "TASK-002"
  ],
  "target_files": [
    "src/components/Footer.jsx"
  ],
  "estimated_complexity": 1,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/components/Footer.jsx: dark slate background, light text, links to Home (/), All Blogs (/blogs), Login (/login), Register (/register), copyright with current year.

**Acceptance:**
- [ ] bg-slate-800 text-slate-300 background
- [ ] Links: Home (/), All Blogs (/blogs), Login (/login), Register (/register)
- [ ] Copyright line includes current year via new Date().getFullYear()
- [ ] Responsive padding and layout

---

## TASK-008 — LandingPage component

```nexus-task
{
  "task_id": "TASK-008",
  "title": "LandingPage component",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-006",
    "TASK-007"
  ],
  "target_files": [
    "src/pages/LandingPage.jsx"
  ],
  "estimated_complexity": 4,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/pages/LandingPage.jsx: full-viewport-height hero with gradient bg (from-indigo-600 via-violet-600 to-pink-500), app name in bold white, tagline 'Your thoughts. Your space. Beautifully simple.', two CTA buttons ('Start Reading' and 'Get Started Free'), CSS-only floating card animation, Features section with 3 cards ('Write Freely', 'Private & Local', 'Instant & Fast'), Latest Posts Preview section reading from writespace_posts (up to 3, sorted newest first), and Footer.

**Acceptance:**
- [ ] Hero section is min-h-screen with gradient from-indigo-600 via-violet-600 to-pink-500
- [ ] App name in large bold white text, tagline present
- [ ] 'Start Reading' CTA: authenticated→/blogs, guests→/login
- [ ] 'Get Started Free' CTA: →/register
- [ ] CSS-only floating card animation (no JS animation libraries)
- [ ] Features section: 3 cards in responsive row (1-col mobile, 3-col desktop)
- [ ] Latest Posts Preview shows up to 3 most recent posts from writespace_posts
- [ ] Each preview card links to /blog/:id; unauthenticated clicks redirect to /login
- [ ] If no posts: 'No posts yet — check back soon!' message
- [ ] Footer rendered at bottom

---

## TASK-009 — LoginPage component

```nexus-task
{
  "task_id": "TASK-009",
  "title": "LoginPage component",
  "status": "in_progress",
  "depends_on": [
    "TASK-003"
  ],
  "target_files": [
    "src/pages/LoginPage.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/pages/LoginPage.jsx: full-viewport gradient bg, centered white card with shadow, app logo. Fields: Username (text), Password (password). On submit: check hard-coded admin (admin/admin) first, then writespace_users. On success: setSession, redirect Admin→/admin, user→/blogs. On failure: inline error. Already-authenticated users redirected to their home. Link to /register.

**Acceptance:**
- [ ] Full-viewport gradient bg from-indigo-600 via-violet-600 to-pink-500
- [ ] Centered white card with shadow, rounded-lg, p-8
- [ ] Username and Password fields with labels
- [ ] Hard-coded admin check (username='admin', password='admin') before localStorage
- [ ] On success: setSession writes to writespace_session, redirects Admin→/admin, user→/blogs
- [ ] On failure: shows 'Invalid username or password.' inline error
- [ ] Already-authenticated users redirected to their home route
- [ ] Link to /register below the form

---

## TASK-010 — RegisterPage component

```nexus-task
{
  "task_id": "TASK-010",
  "title": "RegisterPage component",
  "status": "in_progress",
  "depends_on": [
    "TASK-003"
  ],
  "target_files": [
    "src/pages/RegisterPage.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/pages/RegisterPage.jsx: registration form with Display Name, Username, Password, Confirm Password. All fields required. Password match validation. Username uniqueness check against writespace_users and hard-coded admin. On success: save to writespace_users, setSession, redirect to /blogs. Link back to /login.

**Acceptance:**
- [ ] Fields: Display Name, Username, Password, Confirm Password — all required
- [ ] Password and Confirm Password must match, inline error shown
- [ ] Username uniqueness checked against writespace_users and hard-coded 'admin'
- [ ] On success: user saved to writespace_users with role='user', session created, redirect to /blogs
- [ ] Link back to /login
- [ ] Full-viewport gradient background, centered white card

---

## TASK-011 — Authenticated Navbar component

```nexus-task
{
  "task_id": "TASK-011",
  "title": "Authenticated Navbar component",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-004"
  ],
  "target_files": [
    "src/components/Navbar.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/components/Navbar.jsx: persistent header for authenticated pages. Left: 'WriteSpace' logo linking to /. Center/Right: role-based nav links (Admin sees 'All Blogs', 'Write', 'Users'; user sees 'All Blogs', 'Write'). Active link highlighted with indigo rounded pill. Far right: avatar chip + display name + dropdown with 'Logout'. Mobile hamburger toggle. Logout clears session and redirects to /.

**Acceptance:**
- [ ] Sticky top-0, bg-white, shadow-sm, border-b
- [ ] Logo 'WriteSpace' links to /
- [ ] Admin nav links: 'All Blogs' (/blogs), 'Write' (/write), 'Users' (/users)
- [ ] User nav links: 'All Blogs' (/blogs), 'Write' (/write)
- [ ] Active link has bg-indigo-100 text-indigo-700 rounded-full pill style
- [ ] Far right: avatar chip (getAvatar) + displayName + dropdown with 'Logout'
- [ ] Mobile hamburger toggle using React useState
- [ ] Logout clears writespace_session and redirects to /

---

## TASK-012 — BlogCard component

```nexus-task
{
  "task_id": "TASK-012",
  "title": "BlogCard component",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-004"
  ],
  "target_files": [
    "src/components/BlogCard.jsx"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/components/BlogCard.jsx: card showing title, excerpt (first 120 chars), createdAt (formatted MMM DD, YYYY), author name + avatar. Colorful top border accent cycling from index (indigo, violet, pink, teal). Admin sees pencil Edit icon on every card. User sees pencil Edit icon only on own posts (authorId matches session userId).

**Acceptance:**
- [ ] Card shows title, excerpt (first 120 chars + '...'), formatted date (MMM DD, YYYY), author avatar + name
- [ ] Top border accent cycles: indigo, violet, pink, teal based on index % 4
- [ ] Admin sees pencil Edit icon button on every card
- [ ] User sees pencil Edit icon only on cards where authorId matches session userId
- [ ] Clicking card navigates to /blog/:id

---

## TASK-013 — Home page (Blog List)

```nexus-task
{
  "task_id": "TASK-013",
  "title": "Home page (Blog List)",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-011",
    "TASK-012"
  ],
  "target_files": [
    "src/pages/Home.jsx"
  ],
  "estimated_complexity": 2,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/pages/Home.jsx: reads writespace_posts, sorts newest first, renders responsive grid (1-col mobile, 2-col tablet, 3-col desktop) of BlogCards. Empty state: 'No blogs yet. Be the first to write one!' with Write CTA button.

**Acceptance:**
- [ ] Reads writespace_posts from localStorage via getPosts()
- [ ] Posts sorted newest first by createdAt
- [ ] Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- [ ] Each post rendered as BlogCard with correct index for border accent
- [ ] Empty state shows 'No blogs yet. Be the first to write one!' with button linking to /write
- [ ] Uses Navbar for authenticated header

---

## TASK-014 — ReadBlog page

```nexus-task
{
  "task_id": "TASK-014",
  "title": "ReadBlog page",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-004",
    "TASK-011"
  ],
  "target_files": [
    "src/pages/ReadBlog.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/pages/ReadBlog.jsx: reads post by id from URL params. Displays title (large heading), author avatar + display name, createdAt date, full content with whitespace-pre-wrap. Admin sees Edit and Delete buttons on ALL posts. User sees Edit and Delete only on own posts. Delete uses window.confirm, removes from writespace_posts, redirects to /blogs. Invalid/missing ID shows 'Post not found' with back link.

**Acceptance:**
- [ ] Reads post by id from URL params via useParams()
- [ ] Displays title (text-3xl font-bold), author avatar + name inline, formatted date, content with whitespace-pre-wrap
- [ ] Admin sees Edit (→/edit/:id) and Delete buttons on ALL posts
- [ ] User sees Edit and Delete only on own posts (authorId matches session userId)
- [ ] User on other's posts sees only 'Back to All Posts' button
- [ ] Delete: window.confirm, remove from writespace_posts, redirect to /blogs
- [ ] Invalid/missing id: 'Post not found' with link back to /blogs

---

## TASK-015 — WriteBlog page (Create/Edit)

```nexus-task
{
  "task_id": "TASK-015",
  "title": "WriteBlog page (Create/Edit)",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-011"
  ],
  "target_files": [
    "src/pages/WriteBlog.jsx"
  ],
  "estimated_complexity": 4,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/pages/WriteBlog.jsx: form for creating (/write) or editing (/edit/:id) posts. Fields: Title (text, full-width), Content (textarea, min-h-[256px], full-width). Create mode: generate UUID, set createdAt, authorId, authorName from session, save to writespace_posts, redirect to /blog/:id. Edit mode: pre-fill form, update record. Ownership check: user can only edit own posts, Admin can edit any. Validation: both fields required with inline errors. Character counter below Content. Cancel button routes back.

**Acceptance:**
- [ ] Guests redirected to /login
- [ ] Create mode (/write): generates UUID, sets createdAt, authorId, authorName from session, saves to writespace_posts, redirects to /blog/:id
- [ ] Edit mode (/edit/:id): pre-fills form from existing post, updates record on save, redirects to /blog/:id
- [ ] Ownership check: user can only edit own posts (authorId matches session userId); Admin can edit any
- [ ] If user tries to edit another user's post, redirect to /blogs
- [ ] Validation: both fields required, inline error messages below each field
- [ ] Character counter below Content textarea showing current count
- [ ] Cancel button (ghost style) routes back without saving

---

## TASK-016 — StatCard component

```nexus-task
{
  "task_id": "TASK-016",
  "title": "StatCard component",
  "status": "in_progress",
  "depends_on": [
    "TASK-002"
  ],
  "target_files": [
    "src/components/StatCard.jsx"
  ],
  "estimated_complexity": 1,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/components/StatCard.jsx: reusable admin dashboard stat tile displaying a number, label, and colored icon background. Accepts props: number, label, icon (emoji string), bgColor (Tailwind class).

**Acceptance:**
- [ ] Renders a card with large number, label text below, and icon in colored circle
- [ ] Accepts props: number, label, icon, bgColor
- [ ] Responsive layout within grid

---

## TASK-017 — UserRow component

```nexus-task
{
  "task_id": "TASK-017",
  "title": "UserRow component",
  "status": "in_progress",
  "depends_on": [
    "TASK-004"
  ],
  "target_files": [
    "src/components/UserRow.jsx"
  ],
  "estimated_complexity": 1,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/components/UserRow.jsx: displays a user row/stacked card with avatar, displayName, username, role badge, and delete button. Accepts user object and onDelete callback. Delete button shows confirmation.

**Acceptance:**
- [ ] Shows avatar (getAvatar), displayName, username, role badge
- [ ] Delete button calls onDelete with user id after window.confirm
- [ ] Responsive: table row on desktop, stacked card on mobile

---

## TASK-018 — AdminDashboard page

```nexus-task
{
  "task_id": "TASK-018",
  "title": "AdminDashboard page",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-011",
    "TASK-016"
  ],
  "target_files": [
    "src/pages/AdminDashboard.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/pages/AdminDashboard.jsx: gradient header with 'Admin Dashboard' title. Stat cards showing total posts, total users, and recent posts count. Quick actions section with links to Write Blog, All Blogs, Manage Users. Recent posts list (up to 5 most recent).

**Acceptance:**
- [ ] Gradient header (from-indigo-600 to-violet-600) with 'Admin Dashboard' title
- [ ] Stat cards: total posts count, total users count, recent posts count (last 24h)
- [ ] Quick actions: 'Write Blog' (/write), 'All Blogs' (/blogs), 'Manage Users' (/users)
- [ ] Recent posts list: up to 5 most recent posts with title and date
- [ ] Uses Navbar for authenticated header

---

## TASK-019 — UserManagement page

```nexus-task
{
  "task_id": "TASK-019",
  "title": "UserManagement page",
  "status": "in_progress",
  "depends_on": [
    "TASK-003",
    "TASK-011",
    "TASK-017"
  ],
  "target_files": [
    "src/pages/UserManagement.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/pages/UserManagement.jsx: create user form (Display Name, Username, Password, role select) and user list using UserRow components. Delete user removes from writespace_users. Cannot delete hard-coded admin. Shows success/error messages.

**Acceptance:**
- [ ] Create user form with Display Name, Username, Password, role select (user/admin)
- [ ] Username uniqueness check against writespace_users and hard-coded admin
- [ ] User list rendered with UserRow components
- [ ] Delete user removes from writespace_users, cannot delete hard-coded admin
- [ ] Success/error messages displayed inline
- [ ] Uses Navbar for authenticated header

---

## TASK-020 — App.jsx with routing and conditional navbar

```nexus-task
{
  "task_id": "TASK-020",
  "title": "App.jsx with routing and conditional navbar",
  "status": "in_progress",
  "depends_on": [
    "TASK-005",
    "TASK-006",
    "TASK-008",
    "TASK-009",
    "TASK-010",
    "TASK-011",
    "TASK-013",
    "TASK-014",
    "TASK-015",
    "TASK-018",
    "TASK-019"
  ],
  "target_files": [
    "src/App.jsx"
  ],
  "estimated_complexity": 3,
  "assigned_worker_type": "execution"
}
```

**Description:** Create src/App.jsx: defines all 9 routes using React Router v6. Renders PublicNavbar on public routes (/, /login, /register) and Navbar on authenticated routes. Wraps protected routes with ProtectedRoute. Admin-only routes (/admin, /users) use ProtectedRoute with role='admin'.

**Acceptance:**
- [ ] Route / renders LandingPage with PublicNavbar
- [ ] Route /login renders LoginPage with PublicNavbar
- [ ] Route /register renders RegisterPage with PublicNavbar
- [ ] Route /blogs renders Home with Navbar, wrapped in ProtectedRoute
- [ ] Route /blog/:id renders ReadBlog with Navbar, wrapped in ProtectedRoute
- [ ] Route /write renders WriteBlog with Navbar, wrapped in ProtectedRoute
- [ ] Route /edit/:id renders WriteBlog with Navbar, wrapped in ProtectedRoute
- [ ] Route /admin renders AdminDashboard with Navbar, wrapped in ProtectedRoute role='admin'
- [ ] Route /users renders UserManagement with Navbar, wrapped in ProtectedRoute role='admin'
- [ ] PublicNavbar shown on public routes, Navbar shown on authenticated routes

---
