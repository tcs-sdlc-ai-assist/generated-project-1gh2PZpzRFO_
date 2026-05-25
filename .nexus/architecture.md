# Architecture

_This document is auto-assembled from the per-cluster HLDs produced
in the HLD phase. It is the canonical architectural reference for the
code-generation worker agents._

## High-Level Design (per cluster)

<!-- HLD :: HLD_brCLSdP3SfepjIvqvqr2rA -->
<!-- HLD generated via section-split flow -->

WriteSpace is a fully holistic, single-page blog application built with React 18+ and Vite, delivering a public landing page, role-based authentication (Admin and User roles), and complete content and user management — all persisted exclusively in the browser's localStorage with no backend, no encryption, and no external authentication libraries. This HLD covers the complete architecture for cluster SCRUM-19983, encompassing the public-facing landing experience, self-registration and login flows, authenticated blog CRUD with ownership-based access control, an admin dashboard with statistics and user management, and static-site deployment on Vercel. Driving constraints include: zero backend infrastructure, plain-text password storage (documented MVP tradeoff), client-side-only route guards, exclusive use of JavaScript JSX (no TypeScript), inline Tailwind utility classes only (no custom CSS), useState/useEffect hooks exclusively (no state management libraries), and a hard-coded admin account (admin/admin) that cannot be deleted. The architecture must support 9 client-side routes, role-based redirects, responsive breakpoints across mobile/tablet/desktop, and graceful degradation when localStorage is unavailable or corrupted.

## 1. System Overview

### Business Context & Solution Vision

WriteSpace is conceived as a fully self-contained, single-page blog application that demonstrates the complete lifecycle of content management — from public discovery through authenticated creation, editing, and administration — without requiring any backend infrastructure whatsoever. The driving business need is to deliver a deployable MVP that can serve as both a portfolio piece and a functional foundation for future enhancement, while eliminating the cost, complexity, and operational overhead of server-side components. This directly addresses the core problem articulated in SCRUM-19983: how to build a role-aware, multi-user content platform that can be deployed as a static site on Vercel with zero ongoing infrastructure costs.

The solution vision is a browser-native application where every user interaction — registration, login, blog CRUD, admin oversight — is handled entirely within the client. The browser becomes both the application runtime and the persistence layer. This is not a compromise; it is an intentional architectural choice that aligns with the project's primary constraint: zero backend, zero API calls, zero external services. The application must feel responsive and complete despite operating entirely within a single browser tab's memory and localStorage.

WriteSpace serves three distinct user personas: **guests** who browse the public landing page and can register or log in; **authenticated users** who can create, read, update, and delete their own blog posts; and **administrators** who have full oversight of all content and user accounts. The architecture must support these personas with clear separation of concerns, role-based routing, and ownership-enforced access control — all without a server to enforce anything.

### Execution Model: Single-Page Application

WriteSpace operates as a pure Single-Page Application (SPA). The entire application — all 9 client-side routes, all state management, all data persistence — is delivered as a single HTML shell (`index.html`) with bundled JavaScript and CSS assets. Once the initial page load completes, all subsequent navigation happens client-side via React Router v6, with zero network requests for page transitions. This execution model was chosen for three reasons:

1. **Deployment simplicity**: A static SPA can be hosted on any CDN or static hosting platform. Vercel, the chosen deployment target, serves the SPA with a single rewrite rule that maps all routes to `index.html`, enabling direct URL access for every route (e.g., `/blog/abc-123`, `/admin`, `/users`) without server-side routing configuration.

2. **Offline-capable baseline**: Because all data lives in localStorage and all logic runs in the browser, the application continues to function even when network connectivity is intermittent. This is a deliberate property of the zero-backend architecture, not an accidental side effect.

3. **Development velocity**: Vite's development server provides sub-second Hot Module Replacement (HMR), enabling rapid iteration on UI components and business logic without page reloads. The SPA model eliminates the need to coordinate frontend and backend deployments, which is critical for a single-developer project targeting a 3-4 sprint timeline.

The trade-off accepted here is the loss of server-side rendering (SSR) for SEO and initial load performance. For an MVP that targets portfolio demonstration and stakeholder review rather than organic search discovery, this is an acceptable compromise. Future iterations could introduce SSR via Next.js or a similar framework, but that would fundamentally change the deployment model and is explicitly out of scope for this epic.

### Key Technology Stack

The technology choices for WriteSpace are tightly constrained by the PRD and are selected to maximize developer productivity while minimizing configuration overhead.

| Layer | Technology | Justification |
|---|---|---|
| **UI Framework** | React 18+ | Component-based architecture enables clean separation of concerns across 8 page components and 7 reusable components. React's `useState` and `useEffect` hooks are the only state management tools permitted, enforcing simplicity and preventing over-engineering. |
| **Build Tool** | Vite with `@vitejs/plugin-react` | Vite provides near-instant cold starts and sub-second HMR via native ES module serving. It produces optimized production builds with automatic code splitting. The plugin enables JSX transform without manual Babel configuration. |
| **Styling** | Tailwind CSS (utility classes only) | Inline utility classes eliminate the need for CSS files, CSS modules, or styled-components. Every visual property is expressed directly in the JSX markup, making component styling co-located with structure. The `tailwind.config.js` is minimal — only `content` paths are configured. |
| **Routing** | React Router v6 | Declarative route definitions with nested layouts, route parameters (`/blog/:id`, `/edit/:id`), and programmatic navigation (`useNavigate`). The `<Navigate>` component enables declarative redirects for role-based access control. |
| **Persistence** | Browser localStorage | Three storage keys (`writespace_posts`, `writespace_users`, `writespace_session`) hold all application state. All reads are wrapped in try/catch with empty array fallback to handle private browsing mode or corrupted storage. |
| **ID Generation** | `crypto.randomUUID()` | Native browser API for generating unique identifiers for posts and users. No UUID library dependency required. A fallback comment in the code documents the assumption that all modern browsers support this API. |

The explicit prohibition of TypeScript, Redux, Zustand, Jotai, Context API, and custom CSS files is not an oversight — it is a deliberate constraint to keep the component tree shallow, the dependency graph minimal, and the codebase accessible to developers who may not be familiar with advanced React patterns. The entire application must be implementable by a single developer with proficiency in React, Vite, and Tailwind CSS.

### Architectural Philosophy: Simplicity, Zero-Backend, localStorage Persistence

Three architectural principles govern every design decision in WriteSpace:

**Simplicity First**: The component tree must remain shallow. No component should be more than two levels deep in the hierarchy. State is managed locally within each page component using `useState` — there is no global state store, no context provider, no prop drilling beyond one level. Data flows from localStorage into the component that needs it, and changes are written back to localStorage immediately. This means that if two components need the same data (e.g., the Navbar needs the session, and the page component needs the session), each reads from localStorage independently. The cost of this approach is redundant localStorage reads; the benefit is zero coupling between components and zero state synchronization bugs.

**Zero-Backend by Design**: Every feature must work without a server. Authentication is a simple credential comparison against a hard-coded admin account and a localStorage users array. Route guards are client-side `<Navigate>` redirects. Ownership checks are array filter operations. There is no API to call, no token to validate, no session to expire. This eliminates entire categories of failure modes (network errors, server downtime, CORS issues, authentication token expiry) at the cost of accepting that all security is client-side-only and trivially bypassable. This is documented as an explicit MVP trade-off in code comments.

**localStorage as the Single Source of Truth**: All three data stores — posts, users, and session — are persisted in localStorage and read on demand. There is no in-memory cache, no React state that mirrors localStorage, and no synchronization mechanism. When a user creates a post, the `WriteBlog` component reads the current posts array from localStorage, appends the new post, and writes the updated array back. When the user navigates to the blog list, the `Home` component reads the posts array fresh from localStorage. This read-on-demand pattern ensures that data is always current, at the cost of slightly higher latency for each read (typically < 1ms for arrays under 1000 entries).

### System Boundaries & Constraints Overview

WriteSpace operates within strict boundaries that define what the system is and is not:

| Boundary | In Scope | Out of Scope |
|---|---|---|
| **Runtime** | Browser (Chrome, Firefox, Safari, Edge) | Node.js, server-side rendering, service workers |
| **Persistence** | localStorage (3 keys) | IndexedDB, cookies, sessionStorage, REST API, database |
| **Authentication** | Plain-text credential comparison | OAuth, JWT, SAML, password hashing, MFA |
| **Authorization** | Client-side route guards + component-level ownership checks | Server-enforced access control, API gateways |
| **Deployment** | Vercel static site (single rewrite rule) | Docker, Kubernetes, serverless functions, custom domains |
| **Language** | JavaScript (JSX for components, JS for utilities) | TypeScript, Flow, CoffeeScript |
| **Styling** | Inline Tailwind utility classes | CSS modules, styled-components, Sass, Less, custom CSS files |
| **State Management** | `useState` + `useEffect` hooks | Redux, Zustand, Jotai, Context API, MobX |

The most significant constraint is the **hard-coded admin account** (`admin`/`admin`) that must always exist and cannot be deleted. This account is not stored in `writespace_users`; it is checked first during login before falling through to the localStorage users array. The admin account's posts use a sentinel `authorId` value (the string `"admin"`) that is recognized by ownership checks to grant full access to all posts. This design means the admin account is truly immutable — no user management operation can delete or modify it, and no registration can create a duplicate `admin` username.

### Success Metrics & Key Performance Indicators

The success of the WriteSpace architecture is measured against six concrete metrics, each tied directly to the acceptance criteria and non-functional requirements defined in SCRUM-19983:

| Metric | Target | Measurement Method |
|---|---|---|
| **Route Completeness** | All 9 routes functional per route map | Manual walkthrough of each route with guest, user, and admin sessions |
| **Functional Coverage** | 100% of FR-001 through FR-010 acceptance criteria met | Acceptance criteria checklist verified against running application |
| **TypeScript Zero** | Zero `.ts` or `.tsx` files in final codebase | `find . -name "*.ts" -o -name "*.tsx"` returns empty |
| **Custom CSS Zero** | Zero CSS files beyond `src/index.css` | `find . -name "*.css" ! -name "index.css"` returns empty |
| **Vercel Deployment** | All routes accessible via direct URL on Vercel | Navigate to each route URL directly in browser address bar |
| **End-to-End Flow** | Guest → register → create post → edit post → delete post → logout completes without errors | Single continuous user journey test |

Beyond these quantitative metrics, the architecture is considered successful if a developer unfamiliar with the codebase can understand the data flow, component hierarchy, and access control model within 30 minutes of reading the source code. The simplicity principle is validated not by a number but by the absence of confusion — if the code requires extensive comments to explain why things are structured a certain way, the architecture has failed.

[DIAGRAM_SYSTEM_CONTEXT]

## 2. Architecture Style

### Architectural Pattern: Component-Based SPA with Client-Side Routing

WriteSpace adopts a **component-based single-page application (SPA)** architecture with client-side routing as its foundational pattern. This is not a casual default choice — it is a deliberate architectural decision driven by the application's core constraint: zero backend infrastructure. In a traditional multi-page application (MPA), each route transition triggers a full server round-trip, requiring a backend to serve HTML, manage sessions, and enforce access control. WriteSpace has no backend, so every page transition must happen entirely within the browser. The SPA pattern satisfies this requirement by loading a single HTML shell (`index.html`) and using JavaScript to dynamically swap views as the user navigates.

React 18+ serves as the component framework, providing a declarative model where each UI element is a self-contained component with its own state, lifecycle, and rendering logic. The component tree is shallow by design — no more than three levels deep at any point — which keeps prop-drilling manageable without requiring a state management library. Each component owns a single responsibility: `BlogCard` renders a post preview, `StatCard` renders a dashboard metric, `ProtectedRoute` enforces access control. This decomposition maps directly to the file structure defined in the PRD, where every `.jsx` file in `src/components/` and `src/pages/` corresponds to exactly one architectural component.

Client-side routing is implemented via **React Router v6**, which intercepts navigation events and renders the appropriate page component without a full page reload. The route table in `App.jsx` defines nine routes (`/`, `/login`, `/register`, `/blogs`, `/blog/:id`, `/write`, `/edit/:id`, `/admin`, `/users`), each mapped to a page component. React Router's `<Routes>` and `<Route>` elements provide the declarative routing DSL, while `<Navigate>` and `useNavigate()` handle programmatic redirects after login, logout, and CRUD operations. The `vercel.json` rewrite rule (`{"source": "/(.*)", "destination": "/index.html"}`) ensures that direct URL access to any route works on Vercel by serving the SPA shell for all paths — a critical reliability requirement (NFR-002).

The component-based SPA pattern directly supports the four user stories in SCRUM-19983. Guest users interact with public components (`LandingPage`, `LoginPage`, `RegisterPage`). Authenticated users interact with protected components (`Home`, `ReadBlog`, `WriteBlog`). Admin users interact with admin-scoped components (`AdminDashboard`, `UserManagement`). The same React component tree, same routing infrastructure, same data access layer serves all three personas — the only difference is which components are rendered, controlled by the session state and route guards.

[DIAGRAM_ARCHITECTURE_STYLE]

### Justification: Why No Backend, No State Library, No TypeScript

**No Backend.** The decision to eliminate all backend infrastructure is the single most consequential architectural choice in WriteSpace. It is justified by the application's purpose: a deployable MVP that demonstrates core web application patterns — authentication, authorization, CRUD, role-based access — without the operational overhead of servers, databases, or API gateways. By persisting all data in `localStorage`, WriteSpace achieves zero-cost deployment on Vercel's static hosting tier. There are no server costs, no database provisioning, no connection pooling, no TLS certificate management, no scaling concerns. The entire application is a collection of static files (HTML, CSS, JS) served from a CDN edge node.

This choice carries explicit trade-offs, which are documented and accepted. Data is ephemeral — clearing browser storage or switching devices loses all data. There is no multi-user concurrency model; two users on different browsers cannot see each other's changes in real time. There is no backup, no audit log, no data recovery path. These limitations are acceptable because WriteSpace is explicitly an MVP demo, not a production SaaS platform. The PRD's out-of-scope list (Section 1.5) explicitly excludes backend, REST API, and database. The architecture leans into this constraint rather than fighting it.

**No State Library (Redux, Zustand, Jotai, Context API).** The PRD explicitly prohibits all state management libraries, including React's own Context API. This constraint forces a simpler architecture: component-local state via `useState` and `useEffect` hooks, with data fetched directly from `localStorage` on each render. At first glance, this appears to violate the DRY principle — every component that reads posts must call `getPosts()` from `storage.js`. However, for an application with fewer than ten data-dependent components and a maximum of a few hundred records, this pattern is not only acceptable but preferable. The overhead of a state management library — boilerplate, provider nesting, selector memoization, devtools — would exceed the complexity of the problem it solves.

The key insight is that WriteSpace has no shared mutable state that changes asynchronously. There are no WebSocket updates, no server-side mutations, no optimistic updates requiring rollback. Every data mutation (create post, delete user, update session) is a synchronous `localStorage.setItem()` call followed by an immediate re-render. The `useState` hook is sufficient for this model. Components that need to react to data changes — such as `Home` re-rendering after a post is deleted — simply re-read from `localStorage` in a `useEffect` or on mount. This is not elegant, but it is correct, testable, and trivially simple.

**No TypeScript.** The prohibition against TypeScript is a deliberate simplification for an MVP. TypeScript adds a compilation step, type definition files, interface maintenance, and a learning curve for developers unfamiliar with the type system. For a 20-file JavaScript codebase with straightforward prop shapes (strings, numbers, booleans, simple objects), the benefits of static typing are marginal. The risk of runtime type errors is low because the data model is simple and the component interfaces are narrow. The PRD explicitly requires zero `.ts` or `.tsx` files, and this architectural decision respects that constraint. If WriteSpace were to evolve into a larger application with complex state management and multiple developers, TypeScript would be a natural addition — but for the MVP, JavaScript JSX keeps the build pipeline minimal and the iteration speed high.

### Rejected Alternatives: SSR (Next.js), Monolithic Backend, Redux/Zustand

**Server-Side Rendering (Next.js).** Next.js is the dominant React meta-framework, offering file-based routing, SSR, static site generation (SSG), and API routes. It was rejected for three reasons. First, SSR requires a Node.js server runtime, which contradicts the zero-backend constraint. While Next.js can export a fully static site via `next export`, this loses the SSR benefits and adds framework complexity (getStaticProps, getServerSideProps, ISR) that WriteSpace does not need. Second, Next.js's file-based routing would conflict with the explicit route map defined in the PRD — WriteSpace has exactly nine routes with specific access control rules, and a flat `pages/` directory does not cleanly express role-based routing. Third, the build tooling (Webpack/Babel under Next.js) is heavier than Vite's native ESM-based dev server, adding cold-start latency during development. For a 20-component SPA with no SEO requirements (the landing page is the only public page, and it renders client-side), Next.js is over-engineered.

**Monolithic Backend (Express + PostgreSQL).** A traditional backend with Express.js, a relational database, and REST API endpoints was considered and rejected. This is the standard architecture for production web applications, and it would provide real authentication, encrypted passwords, proper session management, and multi-user concurrency. However, it would also require a cloud server (or container), a database instance, API key management, CORS configuration, and ongoing maintenance. The deployment target would shift from Vercel static hosting to Vercel Serverless Functions or a VPS, increasing cost and complexity. For an MVP whose primary value proposition is "deployable in five minutes with zero infrastructure," a monolithic backend is antithetical to the goal. The PRD's scope explicitly excludes backend, and this architectural decision respects that boundary.

**Redux / Zustand.** Both Redux Toolkit and Zustand were evaluated as state management solutions. Redux was rejected for its ceremonial overhead: store configuration, reducer slices, action creators, dispatch calls, and selector memoization. For an application with three data entities (posts, users, session) and synchronous mutations, Redux adds more lines of boilerplate than application logic. Zustand is lighter but still introduces a global store concept that conflicts with the component-local state model. The PRD explicitly prohibits all state management libraries, and the architecture adheres to this constraint. The `storage.js` utility module serves as the de facto data access layer, and components manage their own rendering state via `useState`.

### Component Hierarchy & Rendering Model

The component hierarchy follows a strict three-tier structure:

| Tier | Role | Examples |
|---|---|---|
| **Root** | Application shell, routing, conditional navbar | `App.jsx`, `BrowserRouter` (in `main.jsx`) |
| **Page** | Full-page view, orchestrates data fetching and layout | `LandingPage`, `Home`, `AdminDashboard` |
| **Leaf** | Reusable UI primitive, no data fetching | `BlogCard`, `StatCard`, `UserRow`, `Avatar` |

The rendering model is straightforward: on every route transition, the page component reads data from `localStorage` via `storage.js` utilities, stores it in local state via `useState`, and passes it down to leaf components as props. There is no caching layer, no memoization, no selector optimization. This is intentional — the data sets are small (typically fewer than 100 records), and `localStorage` reads are synchronous and sub-millisecond. The rendering pipeline is:

1. User clicks a link or types a URL.
2. React Router matches the route and renders the page component.
3. Page component calls `getPosts()` or `getUsers()` in a `useEffect` or during initialization.
4. Data is stored in component state via `useState`.
5. Leaf components receive data as props and render JSX.
6. User interaction (submit, delete, navigate) triggers a `localStorage` write and a state update, causing a re-render.

This model is simple, predictable, and easy to debug. There is no asynchronous data fetching, no loading states (beyond the initial render), and no stale-data concerns because every mutation immediately updates `localStorage` and triggers a re-render.

### Role-Based Access Control Pattern at the Route Level

WriteSpace implements a **two-layer access control** pattern: route-level guards and component-level ownership checks. The route-level guard is implemented in `ProtectedRoute.jsx`, which wraps every authenticated route. It reads the `writespace_session` object from `localStorage` and makes two decisions:

1. **Authentication check**: If no session exists, redirect to `/login`.
2. **Authorization check**: If the route requires the `admin` role (via a `role="admin"` prop on `<ProtectedRoute>`), check `session.role === "admin"`. If the user is not an admin, redirect to `/blogs`.

This pattern is applied declaratively in `App.jsx`:

```jsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Authenticated routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/blogs" element={<Home />} />
    <Route path="/blog/:id" element={<ReadBlog />} />
    <Route path="/write" element={<WriteBlog />} />
    <Route path="/edit/:id" element={<WriteBlog />} />
  </Route>

  {/* Admin-only routes */}
  <Route element={<ProtectedRoute role="admin" />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/users" element={<UserManagement />} />
  </Route>
</Routes>
```

This declarative approach has three advantages. First, it centralizes access control logic in a single component (`ProtectedRoute`), making it easy to audit and modify. Second, it uses React Router's layout route pattern (a `<Route>` with no `path` that wraps child routes) to avoid duplicating the guard logic on every route. Third, it separates the "can this user access this page?" question (handled by `ProtectedRoute`) from the "can this user perform this action?" question (handled by the page component itself).

The second layer — component-level ownership checks — is implemented inside `ReadBlog` and `WriteBlog`. These components compare `session.userId` against `post.authorId`. A regular user can only edit or delete posts where `authorId` matches their `userId`. An admin can edit or delete any post. This two-layer pattern ensures that even if a user somehow navigates to `/edit/someone-elses-post` (e.g., by typing the URL directly), the component will enforce ownership before rendering the edit form.

### Trade-off Analysis: Simplicity vs. Scalability

The central architectural trade-off in WriteSpace is **simplicity over scalability**. Every design decision prioritizes ease of implementation, ease of understanding, and ease of deployment over the ability to handle growth. This is the correct trade-off for an MVP with a target audience of one developer and a handful of demo users.

| Dimension | Simplicity Choice | Scalability Cost |
|---|---|---|
| **Data storage** | `localStorage` (synchronous, single-browser, ephemeral) | No multi-user concurrency, no data persistence across devices, no backup |
| **State management** | `useState` + direct `localStorage` reads | No memoization, no caching, redundant reads on every render |
| **Authentication** | Plain-text passwords, client-side session | No real security, no password recovery, no session expiry |
| **Routing** | Client-side only | No SSR, no SEO for blog posts, no progressive enhancement |
| **Deployment** | Static files on Vercel CDN | No server-side logic, no API endpoints, no background jobs |

Each of these choices is defensible for an MVP. The scalability costs are acceptable because the application is not expected to serve thousands of concurrent users, store millions of records, or handle sensitive data. If WriteSpace were to evolve into a production application, each dimension would need to be addressed: `localStorage` would be replaced with a backend database (Firebase, Supabase, or a custom API), plain-text passwords would be replaced with bcrypt hashing, client-side routing would be supplemented with SSR for SEO, and state management would be introduced to handle asynchronous data fetching and caching.

However, the architecture is designed to accommodate this evolution without a complete rewrite. The `storage.js` module abstracts `localStorage` behind `getPosts()`, `savePosts()`, `getUsers()`, and `saveUsers()` functions. Migrating to a backend API would require replacing the implementations of these four functions — the component interfaces would remain unchanged. Similarly, the `auth.js` module's `getSession()`, `setSession()`, and `clearSession()` functions could be swapped from `localStorage` reads to JWT token management without touching any page component. The component-based architecture ensures that the UI layer is decoupled from the data access layer, providing a clean migration path.

In summary, WriteSpace's architecture is a **pragmatic MVP** — it makes the simplest possible choices that satisfy the functional requirements, documents the trade-offs explicitly, and provides a clear upgrade path for future iterations. This is not an architecture that will scale to millions of users, but it is an architecture that can be built by one developer in three sprints and deployed in five minutes. For the goals of SCRUM-19983, that is the right trade-off.

## 3. Module Decomposition

### Utility Layer: Storage Abstraction & Session Management

The utility layer forms the foundation of WriteSpace's data persistence strategy. It is deliberately thin — two files (`storage.js` and `auth.js`) — that together abstract all interaction with the browser's `localStorage` API. This layer exists to decouple the rest of the application from the raw `localStorage` surface area, providing a consistent, error-safe interface that every component and page depends on.

**`storage.js`** owns the four core data collections: `writespace_posts`, `writespace_users`, and indirectly `writespace_session` (though session is managed by `auth.js`). It exports four functions — `getPosts()`, `savePosts(arr)`, `getUsers()`, `saveUsers(arr)` — each of which wraps `localStorage.getItem` and `localStorage.setItem` in a `try/catch` block. The rationale for this defensive pattern (addressing SCRUM-19983's risk of localStorage being unavailable or corrupted) is that `localStorage` can throw in private browsing modes, when storage quota is exceeded, or when the stored JSON is malformed. Every read function returns `[]` on failure, ensuring that the consuming components never crash on data access — they simply render empty states, which the PRD explicitly requires for graceful degradation.

Why not use a state management library like Redux or Zustand? The PRD explicitly prohibits them (Constraint: "useState + useEffect hooks only, no Redux/Zustand/Jotai/Context API"). This is a deliberate architectural trade-off: for an MVP with no backend, no real-time updates, and a single browser tab, the overhead of a state management library is unjustified. The `storage.js` functions are called directly from page components via `useEffect` on mount, and mutations are written back synchronously. This keeps the data flow linear and debuggable — a developer can open DevTools, inspect `localStorage`, and immediately understand the application state.

**`auth.js`** manages the session object stored under `writespace_session`. It exports three functions: `getSession()` (returns the parsed session object or `null`), `setSession(obj)` (writes the session and returns it), and `clearSession()` (removes the key). The session object shape is `{ userId, username, displayName, role }` — deliberately minimal, containing only what the UI needs to render role-appropriate views. The decision to keep session separate from the user collection is intentional: the session represents the *current authenticated identity*, not the full user record. This separation allows the `ProtectedRoute` component and the `Navbar` to check authentication status with a single `localStorage.getItem` call rather than searching the users array.

A critical design note: `auth.js` does **not** validate session integrity. If a user manually edits `writespace_session` in DevTools to change their role from `"user"` to `"admin"`, the application will treat them as admin. This is an accepted MVP trade-off (documented in code comments per NFR-004). In a production system, session would be a signed JWT verified server-side; here, the threat model assumes a single-user local environment where the user has full access to DevTools anyway. The route guards in `ProtectedRoute` are client-side-only, meaning a determined user can bypass them — but the PRD explicitly accepts this: "Route guards are client-side only. Acceptable for a local MVP with no sensitive data."

The interaction pattern between these two utilities is straightforward: page components import `getPosts()` or `getUsers()` in `useEffect` to load initial state, and call `savePosts()` or `saveUsers()` after mutations. The `LoginPage` and `RegisterPage` call `setSession()` on successful authentication. The `Navbar` calls `getSession()` on every render to determine which links to show. The `ProtectedRoute` calls `getSession()` to decide redirects. There is no event bus, no pub/sub, no cross-tab synchronization — the application is designed for a single browser tab, and any state drift between tabs is an accepted limitation.

### Component Layer: Reusable UI Components (Avatar, BlogCard, StatCard, UserRow, Navbar, ProtectedRoute)

The component layer contains six reusable building blocks that are composed by page-level components. Each has a single responsibility, minimal dependencies, and a clear contract expressed through props. This layer is where the design system defined in the PRD (color palette, button system, role badges, responsive breakpoints) is codified into concrete JSX.

**`Avatar.jsx`** is the simplest component in the system — it exports a single function `getAvatar(role)` that returns a styled `<span>` element. For `role === "admin"`, it renders a crown emoji (👑) with `bg-violet-600` background; for `role === "user"`, it renders a book emoji (📖) with `bg-indigo-500` background. The component is stateless and has zero dependencies — it does not import `auth.js`, `storage.js`, or any other component. This purity is intentional: `Avatar` is used in `Navbar`, `BlogCard`, `UserRow`, `ReadBlog`, and `AdminDashboard`, and any circular dependency would cascade through the entire component tree. By making `Avatar` a pure utility function that returns JSX, we eliminate that risk entirely (addressing SCRUM-19983's risk of circular imports). The component accepts no props beyond `role` — display name and other metadata are rendered by the parent.

**`BlogCard.jsx`** renders a single post preview in the blog list grid. It receives `post` (the full post object), `index` (for deterministic accent color cycling), `currentUserId`, and `currentUserRole` as props. The component is responsible for:
- Rendering the title, excerpt (first 120 characters via `post.content.substring(0, 120)`), formatted date (`new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`), and author avatar + name.
- Applying the cycling top border accent: `index % 4` maps to indigo, violet, pink, or teal.
- Conditionally rendering a pencil edit icon button: visible if `currentUserRole === "admin"` OR `post.authorId === currentUserId`.
- Wrapping the entire card in a `<Link to={`/blog/${post.id}`}>` for navigation.

The ownership check is performed at the component level rather than the page level to keep `Home.jsx` simple — it simply maps over posts and renders `BlogCard` for each. This is a deliberate delegation pattern: the card knows who the current user is and can make its own rendering decisions.

**`StatCard.jsx`** is the simplest dashboard tile, used exclusively in `AdminDashboard`. It receives `label`, `value`, and `bgColor` (a Tailwind gradient class like `bg-gradient-to-br from-violet-500 to-violet-600`). It renders a centered number with a label below, wrapped in a white card with the colored gradient strip. No logic, no state, no dependencies — pure presentational.

**`UserRow.jsx`** renders a single user entry in the User Management page. It receives `user`, `currentUserId`, and `onDelete` callback. On desktop, it renders a table row; on mobile (< 640px), it renders a stacked card layout (using Tailwind's responsive utilities: `hidden md:table-row` for the table variant, `block md:hidden` for the card variant). It renders the user's avatar (via `getAvatar(user.role)`), display name, username, role badge pill (violet for admin, indigo for user), formatted creation date, and a Delete button. The Delete button is disabled with a tooltip if `user.username === "admin"` (the hard-coded admin cannot be deleted) or if `user.id === currentUserId` (users cannot delete themselves). This component encapsulates all the conditional rendering logic for user management, keeping `UserManagement.jsx` focused on layout and state.

**`Navbar.jsx`** and **`PublicNavbar.jsx`** are the two navigation components, conditionally rendered by `App.jsx` based on session state. `PublicNavbar.jsx` is shown when no session exists (guest users) and on the landing page. It renders the WriteSpace logo linking to `/`, and either "Login" and "Get Started" buttons for guests, or an avatar chip + "Go to Dashboard" button for logged-in users (this handles the edge case where a logged-in user navigates to `/`). `Navbar.jsx` is shown on all authenticated pages. It renders role-based navigation links: Admin sees "All Blogs", "Write", and "Users"; user sees "All Blogs" and "Write". The active link is highlighted with an indigo background pill. On the far right, an avatar chip (via `getAvatar`) with the user's display name and a dropdown containing "Logout". On mobile (< 640px), a hamburger toggle expands a vertical menu. The logout action calls `clearSession()` from `auth.js` and navigates to `/`.

**`ProtectedRoute.jsx`** is the route guard wrapper. It accepts an optional `role` prop (defaulting to `null`). On mount, it reads the session via `getSession()`. If no session exists, it renders a `<Navigate to="/login" />`. If a `role` prop is provided (e.g., `"admin"`) and the session's role does not match, it renders `<Navigate to="/blogs" />` (non-admin users trying to access `/admin` or `/users` are redirected to the blog list). If the session is valid and role matches (or no role restriction), it renders `{children}`. This component is stateless — it reads localStorage on every render, which is acceptable for an MVP with no real-time requirements. The redirect logic is implemented as React Router `<Navigate>` components, which trigger instant client-side navigation without a full page reload.

### Page Layer: Route-Level Page Components (Landing, Login, Register, Home, ReadBlog, WriteBlog, AdminDashboard, UserManagement)

The page layer contains eight components, each mapped to a specific route. These are the "smart" components that orchestrate data loading, form handling, and navigation. They import from the utility layer and compose the component layer.

**`LandingPage.jsx`** (route `/`) is the only page accessible without authentication. It renders the hero section (full-viewport-height gradient with app name, tagline, and two CTA buttons), the features section (three cards: "Write Freely", "Private & Local", "Instant & Fast"), the latest posts preview (up to 3 most recent posts from `getPosts()`, sorted by `createdAt` descending), and a footer. The latest posts preview is the only data-dependent section — it calls `getPosts()` in a `useEffect`, slices the first 3, and renders preview cards. If no posts exist, it shows "No posts yet — check back soon!" The CTA buttons use React Router `<Link>` components with conditional `to` paths: "Start Reading" goes to `/blogs` if authenticated, `/login` if guest; "Get Started Free" always goes to `/register`.

**`LoginPage.jsx`** (route `/login`) renders a centered white card on the gradient background. It manages form state with `useState` for `username` and `password`. On submit, it first checks the hard-coded admin credentials (`username === "admin" && password === "admin"`). If matched, it calls `setSession({ userId: "admin", username: "admin", displayName: "Admin", role: "admin" })` and navigates to `/admin`. If not admin, it calls `getUsers()` and searches for a matching username/password pair. On match, it calls `setSession({ userId: user.id, username: user.username, displayName: user.displayName, role: user.role })` and navigates to `/blogs`. On failure, it sets an inline error state. If the user is already authenticated (checked via `getSession()` in `useEffect`), it redirects immediately to the appropriate dashboard.

**`RegisterPage.jsx`** (route `/register`) renders a similar centered card. It manages four fields: `displayName`, `username`, `password`, `confirmPassword`. Validation rules: all fields required, passwords must match, username must be unique across `getUsers()` and the hard-coded `admin`. On success, it generates a new user object with `crypto.randomUUID()`, appends it to `getUsers()`, calls `saveUsers()`, calls `setSession()`, and navigates to `/blogs`.

**`Home.jsx`** (route `/blogs`) is the authenticated blog list. It calls `getPosts()` in `useEffect`, sorts by `createdAt` descending, and maps over the array rendering `BlogCard` for each post. It passes `currentUserId` and `currentUserRole` from `getSession()` to each `BlogCard` for ownership-based edit controls. If the posts array is empty, it renders the empty state with a "Write a Blog" CTA button linking to `/write`.

**`ReadBlog.jsx`** (route `/blog/:id`) reads the `id` param via `useParams()`, calls `getPosts()`, and finds the matching post. If not found, it renders "Post not found" with a back link. If found, it renders the full post: title, author avatar + name, formatted date, and content with `whitespace-pre-wrap`. It conditionally renders Edit and Delete buttons based on ownership: Admin sees both on all posts; user sees both only on own posts (`post.authorId === session.userId`); user on another's post sees only "Back to All Posts". Delete triggers `window.confirm()`, then removes the post from `getPosts()`, calls `savePosts()`, and navigates to `/blogs`.

**`WriteBlog.jsx`** (routes `/write` and `/edit/:id`) handles both create and edit modes. It determines mode by checking for the `id` param. In edit mode, it loads the existing post, performs an ownership check (if user is not admin and `post.authorId !== session.userId`, redirect to `/blogs`), and pre-fills the form. The form manages `title` and `content` state, with validation requiring both fields non-empty. A character counter displays below the content textarea. On save in create mode, it generates a new post with `crypto.randomUUID()`, `createdAt: new Date().toISOString()`, `authorId` and `authorName` from session, appends to `getPosts()`, calls `savePosts()`, and navigates to `/blog/:id`. In edit mode, it updates the existing post in-place and navigates to `/blog/:id`.

**`AdminDashboard.jsx`** (route `/admin`) calls `getPosts()` and `getUsers()` in `useEffect` to compute four stat card values: total posts (`posts.length`), total users (`users.length`), total admins (`users.filter(u => u.role === "admin").length`), and total users again (the PRD specifies four cards, with the fourth being a duplicate "Total Users" — this is intentional per FR-009). It renders the gradient header, four `StatCard` components with distinct colors, two quick-action buttons ("Write New Post" → `/write`, "Manage Users" → `/users`), and a "Recent Posts" section showing the 5 most recent posts with inline Edit and Delete controls.

**`UserManagement.jsx`** (route `/users`) renders a create-user form at the top (Display Name, Username, Password, Role dropdown) and a list of existing users below. On desktop, users are displayed in a table; on mobile, as stacked cards. Each user row/card is rendered via `UserRow`. The create form validates uniqueness and required fields. Delete triggers `window.confirm()` and removes the user from `getUsers()`, calling `saveUsers()`. The hard-coded admin's delete button is permanently disabled with a tooltip.

### Configuration Layer: Vite, Tailwind, PostCSS, Vercel Config

The configuration layer consists of four files that define the build toolchain and deployment target. These are not "modules" in the traditional sense, but they are critical architectural elements that constrain the entire application's behavior.

**`vite.config.js`** is minimal — it imports `@vitejs/plugin-react` and registers it. No aliases, no environment variables, no proxy configuration. The decision to use Vite over Create React App (CRA) is driven by Vite's superior HMR performance (sub-200ms updates vs CRA's multi-second rebuilds) and its native ES module support, which eliminates the need for a bundler during development. Vite's production build produces optimized static assets that deploy directly to Vercel.

**`tailwind.config.js`** defines the content paths (`"./index.html"` and `"./src/**/*.{js,jsx}"`) and uses the default theme with no extensions. The decision to use Tailwind's default color palette (indigo, violet, pink, teal, slate) rather than custom colors is deliberate: it eliminates the need for a design token file and keeps the configuration minimal. All colors used in the PRD's design system map directly to Tailwind's built-in palette.

**`postcss.config.js`** registers `tailwindcss` and `autoprefixer` plugins. This is the standard PostCSS setup for Tailwind v3+ with Vite. No custom PostCSS plugins are needed.

**`vercel.json`** contains exactly one key: `rewrites`, with a single rule that maps all paths (`/(.*)`) to `/index.html`. This is the standard SPA fallback configuration that ensures direct URL access (e.g., navigating to `/blogs` or `/admin` in the browser address bar) serves the React app rather than returning a 404. The PRD explicitly warns against adding any other keys (`builds`, `buildCommand`, `outputDirectory`, `installCommand`, `framework`) — Vercel auto-detects Vite projects and handles build configuration automatically.

### Module Dependency Graph & Import Boundaries

The module dependency graph follows a strict unidirectional pattern: **Configuration → Entry → Pages → Components → Utilities**. No module should import from a layer above it.

[DIAGRAM_MODULE_DECOMPOSITION]

The import boundaries are:
- **Utilities** (`storage.js`, `auth.js`): Import nothing from the application (only `crypto.randomUUID()` which is a global). They are the leaf nodes of the dependency graph.
- **Components** (`Avatar.jsx`, `BlogCard.jsx`, `StatCard.jsx`, `UserRow.jsx`, `Navbar.jsx`, `PublicNavbar.jsx`, `ProtectedRoute.jsx`): May import from utilities (`auth.js` for session checks) and from React Router (`Link`, `Navigate`). `Avatar.jsx` imports nothing. `BlogCard.jsx` imports `Avatar.jsx`. `UserRow.jsx` imports `Avatar.jsx`. `Navbar.jsx` imports `Avatar.jsx` and `auth.js`. `ProtectedRoute.jsx` imports `auth.js` and React Router.
- **Pages** (`LandingPage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`, `Home.jsx`, `ReadBlog.jsx`, `WriteBlog.jsx`, `AdminDashboard.jsx`, `UserManagement.jsx`): May import from utilities (`storage.js`, `auth.js`), from components (all six), and from React Router (`useParams`, `useNavigate`, `Link`, `Navigate`).
- **Entry** (`App.jsx`, `main.jsx`): `main.jsx` imports React, ReactDOM, BrowserRouter, App, and index.css. `App.jsx` imports all page components, `ProtectedRoute`, `Navbar`, `PublicNavbar`, and `auth.js`.
- **Configuration** (`vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json`, `index.html`): Import nothing from the application code.

This strict layering prevents circular dependencies entirely. The only potential risk is if a page component imports another page component — this is prohibited by convention and enforced through code review. Each page is a self-contained unit that can be developed and tested independently.

### Module Ownership & Change Impact Analysis

Each module has a clear owner (the developer or team responsible for its implementation and maintenance) and a defined change impact scope.

| Module | Owner | Change Impact | Risk Level |
|---|---|---|---|
| `storage.js` | Developer | All pages that read/write data (Home, ReadBlog, WriteBlog, AdminDashboard, UserManagement, LandingPage, LoginPage, RegisterPage) | High — changes to storage schema or error handling cascade to all data-dependent components |
| `auth.js` | Developer | ProtectedRoute, Navbar, PublicNavbar, LoginPage, RegisterPage, WriteBlog, ReadBlog, AdminDashboard, UserManagement | High — session shape changes affect all authentication-dependent logic |
| `Avatar.jsx` | Developer | Navbar, BlogCard, UserRow, ReadBlog, AdminDashboard | Low — pure presentational; changes only affect visual rendering |
| `BlogCard.jsx` | Developer | Home, AdminDashboard | Medium — ownership logic changes affect who sees edit controls |
| `StatCard.jsx` | Developer | AdminDashboard | Low — pure presentational |
| `UserRow.jsx` | Developer | UserManagement | Medium — delete logic changes affect user management workflow |
| `Navbar.jsx` / `PublicNavbar.jsx` | Developer | App.jsx (conditional rendering) | Medium — navigation structure changes affect all authenticated pages |
| `ProtectedRoute.jsx` | Developer | App.jsx (route wrapping) | High — redirect logic changes affect the entire routing security model |
| `LandingPage.jsx` | Developer | None (leaf page) | Low — isolated to `/` route |
| `LoginPage.jsx` | Developer | None (leaf page) | Medium — authentication logic changes affect user onboarding |
| `RegisterPage.jsx` | Developer | None (leaf page) | Medium — registration logic changes affect user creation |
| `Home.jsx` | Developer | None (leaf page) | Low — isolated to `/blogs` route |
| `ReadBlog.jsx` | Developer | None (leaf page) | Medium — ownership enforcement changes affect post access control |
| `WriteBlog.jsx` | Developer | None (leaf page) | High — create/edit logic changes affect the core content management workflow |
| `AdminDashboard.jsx` | Developer | None (leaf page) | Low — isolated to `/admin` route |
| `UserManagement.jsx` | Developer | None (leaf page) | Medium — user CRUD changes affect admin workflow |
| `App.jsx` | Developer | All routes | Critical — routing structure changes affect the entire application navigation |
| Configuration files | Developer | Build pipeline, deployment | High — misconfiguration breaks builds or deployment |

The change impact analysis reveals that `storage.js`, `auth.js`, `ProtectedRoute.jsx`, and `App.jsx` are the highest-risk modules. Any change to these requires regression testing across multiple pages. The leaf pages (LandingPage, Home, AdminDashboard) are low-risk because they have no downstream consumers. The `WriteBlog.jsx` module is marked high-risk despite being a leaf because it contains the most complex business logic (create vs edit mode, ownership enforcement, form validation) — a bug here directly impacts the core content management workflow.

This ownership model assumes a single developer working on all modules (consistent with the "single full-stack developer" estimate in SCRUM-19983). In a team setting, ownership would be distributed by layer: one developer owns utilities and components, another owns pages, and a third owns configuration and deployment. The strict unidirectional dependency graph ensures that parallel development is possible without merge conflicts — the component developer can build and test components in isolation using mock data, while the page developer builds pages using those components.

**Trade-off: Single file vs. split utilities.** The decision to keep `storage.js` and `auth.js` as separate files rather than a single `db.js` is deliberate. `auth.js` changes when authentication logic changes (e.g., adding session validation); `storage.js` changes when data schema changes (e.g., adding a new collection). Separating them reduces the blast radius of changes and makes the codebase more navigable. The alternative — a single `localStorage` wrapper — would couple authentication concerns with data persistence concerns, violating the Single Responsibility Principle.

**Trade-off: Component-level ownership checks vs. page-level.** The decision to pass `currentUserId` and `currentUserRole` down to `BlogCard` and `UserRow` rather than performing ownership checks in the page component is a trade-off between component reusability and coupling. It makes `BlogCard` more coupled to the authentication model, but it keeps `Home.jsx` simpler and avoids duplicating the ownership logic if `BlogCard` is used elsewhere (e.g., in `AdminDashboard`'s recent posts section). The alternative — performing the check in the page and passing a boolean `canEdit` prop — would be cleaner but would require the page to duplicate the ownership logic for each usage context.

## 4. Component Responsibilities

### Component Inventory & Purpose Mapping

The WriteSpace application comprises a deliberately minimal component inventory — 7 reusable components, 8 page-level components, and 2 utility modules — each with a single, well-defined responsibility. This lean inventory is a direct consequence of the architectural constraints: no state management library, no TypeScript, no custom CSS, and a shallow component tree. Every component exists to serve exactly one of three purposes: **role enforcement**, **data display**, or **page orchestration**. Understanding this tripartite taxonomy is essential before examining individual responsibilities.

**Role Enforcement Components** (3): `ProtectedRoute`, `Navbar`, `Avatar` — these components collectively implement the application's authorization boundary. They are the gatekeepers. `ProtectedRoute` decides whether a user can access a route. `Navbar` surfaces role-appropriate navigation options. `Avatar` provides a visual, at-a-glance indicator of the user's role. These three components form a cohesive authorization layer that, while client-side only (an explicit MVP tradeoff per NFR-004), provides sufficient UX-level access control for a demo application with no sensitive data.

**Data Display Components** (4): `BlogCard`, `StatCard`, `UserRow`, and the utility-level `getAvatar` export from `Avatar.jsx` — these components are pure presentational units. They receive data via props, apply Tailwind styling, and render. They hold no state, perform no side effects, and make no decisions about data ownership or access control. Their sole responsibility is visual representation of domain entities (posts, statistics, users) in a consistent, responsive manner.

**Page-Level Orchestrators** (8): `LandingPage`, `LoginPage`, `RegisterPage`, `Home`, `ReadBlog`, `WriteBlog`, `AdminDashboard`, `UserManagement` — these are the composition roots. Each page component is responsible for: (1) reading data from localStorage via the utility layer, (2) applying business logic (ownership checks, sorting, filtering), (3) composing child components, and (4) handling user interactions that mutate state. Pages are the only components that import from `src/utils/storage.js` and `src/utils/auth.js` directly, establishing a clean dependency hierarchy.

**Utility Modules** (2): `storage.js` and `auth.js` — these are not components but are included here because they define the data access contract that all components depend upon. `storage.js` owns all localStorage read/write operations with try/catch error handling. `auth.js` owns session lifecycle management. Both modules are stateless singletons — they operate on the browser's storage API directly, with no caching layer, no memoization, and no in-memory state. This is intentional: the localStorage API is synchronous and fast enough for MVP-scale data (hundreds of posts, dozens of users), and adding an in-memory cache would introduce staleness risks without meaningful performance gain.

[DIAGRAM_COMPONENT_INVENTORY]

### Ownership Boundaries: What Each Component Owns and Does Not Own

Defining clear ownership boundaries is critical in a component-based SPA where multiple components read from and write to the same localStorage keys. Without explicit boundaries, components can easily step on each other's data, create inconsistent state, or duplicate business logic. The following matrix codifies what each component owns and, equally importantly, what it explicitly does **not** own.

| Component | Owns | Does Not Own | Rationale |
|---|---|---|---|
| `ProtectedRoute` | Route access decision (allow/redirect) | Session state, user data, role definitions | The guard only checks `writespace_session`; it does not validate credentials or manage sessions |
| `Navbar` | Navigation link visibility, active link highlighting, logout trigger | Session data, avatar rendering, route definitions | Navbar receives session via `getSession()` but delegates avatar rendering to `Avatar` component |
| `Avatar` | Visual representation of role (emoji + color) | User identity, role assignment, click handling | Pure presentational; receives `role` as prop and returns JSX |
| `BlogCard` | Post preview rendering (title, excerpt, date, author) | Ownership decisions, edit button visibility logic | Receives `showEdit` boolean as prop; does not compute ownership itself |
| `StatCard` | Number + label display with colored background | Data aggregation, statistics computation | Receives pre-computed `value` and `label` props |
| `UserRow` | User row/card rendering (avatar, name, username, role, date) | Delete authorization, user data mutation | Receives `onDelete` callback; does not call `storage.js` directly |
| `LandingPage` | Public page composition, latest posts preview | Authentication state, user session | Reads posts from localStorage but does not check session |
| `LoginPage` | Credential validation, session creation, redirect logic | User registration, password storage | Only reads `writespace_users`; does not write to it |
| `RegisterPage` | Account creation, username uniqueness validation, session creation | Login authentication, post management | Only writes to `writespace_users`; does not touch `writespace_posts` |
| `Home` | Blog list rendering, sorting, empty state | Post creation, deletion, editing | Reads all posts, sorts by date, passes to `BlogCard` grid |
| `ReadBlog` | Single post display, ownership-based edit/delete controls | Post list state, navigation state | Reads one post by ID; handles delete via `storage.js` directly |
| `WriteBlog` | Post create/update form, ownership enforcement, validation | Post list rendering, user management | Reads/writes single post; ownership check is inline business logic |
| `AdminDashboard` | Dashboard composition, stat computation, recent posts | User management, post CRUD | Computes stats from `getPosts()` and `getUsers()`; delegates to `StatCard` |
| `UserManagement` | User CRUD (create/delete), role assignment, hard-coded admin protection | Post management, dashboard stats | Reads/writes `writespace_users`; enforces admin undeletable constraint |
| `storage.js` | localStorage read/write, error handling, data format | Business logic, validation, session management | Pure data access layer; no knowledge of roles or ownership |
| `auth.js` | Session read/write/clear, session format | User credentials, post data, user list | Thin wrapper around `writespace_session` key |

This boundary design ensures that business logic lives in page components, data access lives in utility modules, and presentational components remain dumb. The key architectural insight is that **ownership checks are duplicated** — both `ReadBlog` and `WriteBlog` independently verify that the current user can edit/delete a post. This duplication is intentional and necessary: it prevents a user from navigating directly to `/edit/:id` for a post they don't own, even if the UI hides the edit button on the list page. Defense in depth at the component level.

### Interaction Patterns: Props Flow, Callback Propagation, localStorage Reads/Writes

WriteSpace employs a strict **unidirectional data flow** pattern, consistent with React's design philosophy, but adapted for the localStorage persistence layer. The flow is: **localStorage → utility module → page component → child component (via props) → user action → callback → page component → utility module → localStorage**. There is no Context API, no Redux, no event bus — just props flowing down and callbacks flowing up.

**Props Flow (Downward)**: Page components read data from localStorage via utility functions, then pass that data as props to child display components. For example, `Home.jsx` calls `getPosts()` from `storage.js`, sorts the array by `createdAt` descending, maps over the sorted array, and renders a `<BlogCard>` for each post. The props passed to `BlogCard` include: `post` (the full post object), `showEdit` (a boolean computed by `Home` based on session role and post ownership), and `index` (for cycling accent colors). `BlogCard` never calls `getPosts()` itself — it receives everything it needs via props.

**Callback Propagation (Upward)**: When a child component needs to trigger a state mutation (e.g., `UserRow`'s delete button), it does not call `storage.js` directly. Instead, it receives an `onDelete` callback prop from its parent page component. The parent handles the actual mutation. This pattern keeps data mutation logic centralized in page components, making it easier to reason about state changes and ensuring that localStorage writes happen from a single location per operation.

**localStorage Read/Write Patterns**: All localStorage interactions follow a consistent pattern defined in `storage.js`:

```javascript
// Read pattern (wrapped in try/catch)
export const getPosts = () => {
  try {
    const data = localStorage.getItem('writespace_posts');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to read posts from localStorage:', error);
    return []; // Graceful fallback per NFR-002
  }
};

// Write pattern (wrapped in try/catch)
export const savePosts = (posts) => {
  try {
    localStorage.setItem('writespace_posts', JSON.stringify(posts));
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error);
  }
};
```

This pattern is replicated identically for `getUsers()`/`saveUsers()` and `getSession()`/`setSession()`/`clearSession()`. The try/catch wrapping is non-negotiable — it addresses the risk of localStorage being unavailable (private browsing, storage quota exceeded, corrupted data) as documented in the epic's risk register.

**Session Read Pattern**: Components that need session data (Navbar, ProtectedRoute, all page components) call `getSession()` from `auth.js` at render time. There is no caching — every render triggers a synchronous localStorage read. This is acceptable because localStorage reads are sub-millisecond operations, and the session object is tiny (4 fields). The alternative — storing session in React state at the App level and passing it via props — was rejected because it would require lifting state up to `App.jsx` and passing session through the entire component tree, creating unnecessary coupling. The direct read approach is simpler and aligns with the "no state management library" constraint.

[DIAGRAM_PROPS_FLOW]

### Role Enforcement Components: ProtectedRoute, Navbar, Avatar

These three components form the authorization layer of WriteSpace. They are the only components that make role-based decisions, and they do so through different mechanisms: route-level gating, navigation-level visibility, and visual-level identification.

**ProtectedRoute** is the outermost enforcement point. It wraps route definitions in `App.jsx` and intercepts every navigation to protected routes. Its logic is straightforward:

1. On mount and on every navigation, read `writespace_session` from localStorage via `getSession()`.
2. If no session exists (guest user), render a `<Navigate to="/login" replace />` — this redirects the user to the login page while preserving no history entry for the protected route.
3. If a session exists but the route requires an `admin` role (checked via a `role` prop on `ProtectedRoute`), and the session's `role` is `"user"`, render `<Navigate to="/blogs" replace />`.
4. If the session exists and passes the role check, render the child route component via `<Outlet />`.

The decision to use `<Navigate replace />` rather than `window.location` redirect is deliberate: it keeps the redirect within React Router's declarative navigation model, preserving SPA behavior and avoiding full page reloads. The `replace` prop ensures the browser's back button doesn't return to the protected route after redirect.

**Navbar** is the second enforcement layer. It reads the session on every render and conditionally renders navigation links based on role. The Admin sees four links: "All Blogs" (`/blogs`), "Write" (`/write`), "Dashboard" (`/admin`), and "Users" (`/users`). The user sees two links: "All Blogs" (`/blogs`) and "Write" (`/write`). The active link is highlighted using `useLocation()` from React Router — the component compares the current pathname against each link's `to` prop and applies an indigo background pill style to the matching link.

The mobile hamburger menu is implemented with a `useState` boolean toggle — no external library, no CSS animations, just conditional rendering of a mobile menu div. This aligns with the "no custom CSS" constraint and the preference for inline Tailwind classes.

**Avatar** is the simplest of the three but architecturally significant. It is exported as a function `getAvatar(role)` that returns JSX, not as a component. This design choice was made because avatars appear in multiple contexts (Navbar chip, BlogCard author line, UserRow) and rendering them as function calls rather than component instances avoids unnecessary React reconciliation overhead. The function returns a `<span>` element with:
- Admin: crown emoji (`👑`), `bg-violet-600` background, white text
- User: book emoji (`📖`), `bg-indigo-500` background, white text
- Fallback (unknown role): question mark emoji (`❓`), `bg-slate-400` background

The avatar is always rendered as an inline `flex items-center justify-center` span with `w-8 h-8 rounded-full` dimensions, making it consistently sized across all contexts.

### Data Display Components: BlogCard, StatCard, UserRow

These three components are the visual vocabulary of WriteSpace. They are stateless, side-effect-free, and receive all data via props. Their design follows a consistent pattern: a container div with Tailwind styling, conditional rendering based on props, and callback props for user interactions.

**BlogCard** renders a single post preview. Its visual structure is: a white card with a colored top border (cycling through indigo, violet, pink, teal based on `index % 4`), the post title as a heading, an excerpt (first 120 characters of content with ellipsis), the author's avatar and display name inline, the formatted `createdAt` date, and an optional edit icon button. The edit icon is rendered only when the `showEdit` prop is `true`. The entire card is wrapped in a `<Link to={`/blog/${post.id}`}>` making it clickable. The edit button uses `event.stopPropagation()` to prevent the card's link from firing when the edit icon is clicked.

**StatCard** is the simplest component — a colored tile displaying a large number and a label. It receives `value`, `label`, and `bgColor` as props. The `bgColor` prop is a Tailwind background class (e.g., `bg-indigo-500`, `bg-violet-500`, `bg-pink-500`, `bg-teal-500`). The component renders a rounded-lg card with the specified background, white text, the value in a large font (`text-3xl font-bold`), and the label in a smaller font below. No interactivity, no state, no callbacks.

**UserRow** renders a single user entry in either table row format (desktop) or stacked card format (mobile). It receives `user` (the full user object), `isCurrentUser` (boolean to disable self-deletion), `isHardcodedAdmin` (boolean to disable admin deletion), and `onDelete` (callback function). The component renders: the user's avatar (via `getAvatar(user.role)`), display name, username, role badge pill (violet for admin, indigo for user), formatted `createdAt` date, and a delete button. The delete button is disabled (with a tooltip) if `isHardcodedAdmin` is true, or if `isCurrentUser` is true. The responsive layout uses Tailwind's `hidden md:table-row` for the table variant and `block md:hidden` for the card variant — both are rendered in the DOM, with CSS controlling visibility.

### Page-Level Orchestrators: How Pages Compose Components

Page components are the composition roots — they import utility functions, read data, apply business logic, and compose child components. Each page follows a consistent lifecycle pattern:

1. **Data Acquisition**: On mount (via `useEffect`), the page reads data from localStorage using utility functions. For example, `Home.jsx` calls `getPosts()` and `getSession()`.
2. **Business Logic**: The page applies sorting, filtering, and ownership checks. For example, `Home.jsx` sorts posts by `createdAt` descending and computes the `showEdit` boolean for each post based on session role and `authorId`.
3. **Composition**: The page renders its layout (header, content area, optional sidebar) and passes data to child components via props.
4. **Interaction Handling**: The page defines callback functions that handle user actions (create, edit, delete, logout) and passes them to child components.
5. **State Mutation**: When a callback fires, the page mutates data via utility functions and optionally updates local state to trigger a re-render.

**Example: Home.jsx Orchestration**

```javascript
function Home() {
  const [posts, setPosts] = useState([]);
  const session = getSession();

  useEffect(() => {
    const allPosts = getPosts();
    // Sort newest first
    allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(allPosts);
  }, []);

  const isAdmin = session?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">All Blogs</h1>
      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              showEdit={isAdmin || session?.userId === post.authorId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

This pattern — `useState` + `useEffect` + direct utility calls — is replicated across all page components. The absence of Context API or state management libraries means each page is self-contained. Data is read fresh from localStorage on every mount, which eliminates stale state concerns but means pages do not reactively update when data changes in another tab (an acceptable limitation per the epic's assumptions).

**Example: WriteBlog.jsx Orchestration**

`WriteBlog.jsx` is the most complex page because it handles both create and edit modes, ownership enforcement, and form validation. Its orchestration logic:

1. Determine mode from route: if `useParams().id` exists, it's edit mode; otherwise, create mode.
2. In edit mode: read the post by ID from localStorage, verify ownership (if user is not admin and `authorId` doesn't match session `userId`, redirect to `/blogs`), pre-fill form fields.
3. Render form with controlled inputs (`useState` for title and content), character counter for content, validation errors as local state.
4. On submit: generate UUID (create mode) or use existing ID (edit mode), set `createdAt` (create) or preserve existing (edit), set `authorId` and `authorName` from session, save to localStorage via `savePosts()`, redirect to `/blog/:id`.

### Failure Domains: Empty States, Error Boundaries, localStorage Fallbacks

WriteSpace's failure handling strategy is designed around the reality that localStorage is an unreliable persistence layer — it can be unavailable (private browsing), corrupted (manual editing via DevTools), or full (storage quota exceeded). Every component must degrade gracefully.

**Empty States**: Every page that renders a list or collection has an explicit empty state. These are not afterthoughts — they are first-class UI states rendered when the data array is empty or the requested entity is not found.

| Page | Empty State Condition | Empty State UI |
|---|---|---|
| `Home` | `getPosts()` returns `[]` | "No blogs yet. Be the first to write one!" with a "Write a Blog" CTA button linking to `/write` |
| `ReadBlog` | No post matches `:id` param | "Post not found" message with "Back to All Posts" link to `/blogs` |
| `AdminDashboard` | `getPosts()` returns `[]` | "No posts yet" in the Recent Posts section |
| `UserManagement` | `getUsers()` returns only the hard-coded admin | Table shows only the admin row; create form still available |
| `LandingPage` | `getPosts()` returns `[]` | "No posts yet — check back soon!" in the Latest Posts Preview section |

**Error Boundaries**: React Error Boundaries are implemented at the page level. Each page component is wrapped in a class-based error boundary component (`ErrorBoundary.jsx`) that catches rendering errors in the component tree below it. When an error is caught, the boundary renders a fallback UI: "Something went wrong" with a "Go Home" button. This prevents a single component crash from taking down the entire application. The error boundary is intentionally not implemented at the App level — doing so would hide errors and make debugging difficult. Instead, each page has its own boundary, allowing other pages to continue functioning if one crashes.

**localStorage Fallbacks**: The most critical failure domain is localStorage itself. The `storage.js` utility implements a three-tier fallback strategy:

1. **Primary**: Read from localStorage via `getItem()`. If the key exists and parses successfully as JSON, return the parsed data.
2. **Fallback 1**: If `getItem()` returns `null` (key doesn't exist), return the default value (`[]` for arrays, `null` for session).
3. **Fallback 2**: If `getItem()` throws (storage unavailable, corrupted JSON), catch the error, log it to console, and return the default value.

This strategy ensures that the application never crashes due to localStorage failures. The worst case is that data appears empty — the user sees empty states instead of error screens. Data loss is possible (if localStorage is cleared or corrupted), but this is an accepted risk for an MVP with no backend.

**Session Fallback**: The `getSession()` function follows the same pattern but returns `null` as its fallback. Components that call `getSession()` must handle the `null` case — typically by treating it as an unauthenticated user and redirecting to `/login`. The `ProtectedRoute` component explicitly checks for `null` session and redirects accordingly.

[DIAGRAM_FAILURE_DOMAINS]

### Summary: Component Responsibility Architecture

The component responsibility architecture of WriteSpace is deliberately simple — 7 reusable components, 8 pages, 2 utilities — but the boundaries between them are precisely defined. The key architectural decisions are:

1. **Pages own business logic and data mutation**; components are presentational shells.
2. **Ownership checks are duplicated** at the route level (`ProtectedRoute`), the navigation level (`Navbar`), and the page level (`ReadBlog`, `WriteBlog`) for defense in depth.
3. **localStorage reads are uncached** — every render fetches fresh data, accepting the performance cost for simplicity.
4. **Error handling is layered** — try/catch at the utility layer, error boundaries at the page layer, empty states at the UI layer.
5. **Avatar is a function, not a component** — avoiding unnecessary React reconciliation for a purely visual element.

This architecture directly supports the epic's success metrics: all 9 routes functional, zero TypeScript files, zero custom CSS files, and graceful degradation under failure conditions. The component boundaries are designed to be implemented by a single developer across 3-4 sprints, with each component having a clear, testable responsibility that can be developed and verified independently.

[DIAGRAM_COMPONENT_INTERACTIONS]

## 5. Data Flow

### End-to-End Authentication Flow: Registration → Session Creation → Role-Based Redirect

The authentication flow in WriteSpace is the gate through which all protected functionality is accessed. It is a purely client-side, localStorage-mediated process with no network calls, no token exchange, and no cryptographic handshake — by deliberate design for this MVP. The flow encompasses three distinct entry points (registration, login with hard-coded admin, login with stored user) that converge on a single session-writing mechanism and diverge again at role-based redirect.

**Registration Flow (FR-003)**

When a guest user submits the registration form at `/register`, the data journey proceeds as follows:

1. **Form Validation (Client-Side Only)**: The `RegisterPage` component validates four fields — display name, username, password, and confirm password — using inline React state (`useState`). Validation rules are: all fields required, password and confirm password must match, username must be at least 3 characters. These checks happen synchronously in the component's submit handler before any storage interaction occurs. If validation fails, the component sets field-level error state that renders inline error messages below the respective inputs; the data flow terminates at the component boundary.

2. **Username Uniqueness Check**: After passing validation, the component calls `getUsers()` from `src/utils/storage.js`. This function reads the `writespace_users` key from localStorage, parses the JSON array, and returns it — or returns an empty array `[]` if the key is missing, the JSON is malformed, or localStorage is unavailable (all wrapped in try/catch). The component then checks whether the submitted username already exists in the returned array OR matches the hard-coded admin username `"admin"`. This is a linear scan of an in-memory array; for the expected scale of this MVP (tens to low hundreds of users), this O(n) check is acceptable. If a duplicate is found, the component sets a field-level error on the username input and stops.

3. **Account Creation**: With uniqueness confirmed, the component constructs a new user object conforming to the `writespace_users` schema:
   - `id`: generated via `crypto.randomUUID()`
   - `displayName`: from form input
   - `username`: from form input (lowercased for consistency)
   - `password`: stored in **plain text** — this is a documented MVP trade-off (see NFR-004 and Security Architecture section 7)
   - `role`: hard-coded to `"user"` — self-registration never produces an admin account
   - `createdAt`: `new Date().toISOString()`

4. **Persistence**: The component calls `getUsers()`, pushes the new user object onto the array, then calls `saveUsers(updatedArray)`. The `saveUsers` function in `storage.js` calls `localStorage.setItem('writespace_users', JSON.stringify(array))`, wrapped in try/catch. If the write fails (e.g., storage quota exceeded), the catch block silently swallows the error — the user will see no feedback, which is a known limitation. In a production system this would require user-facing error handling, but for the MVP the assumption is that localStorage is available and has sufficient capacity.

5. **Session Creation**: Immediatel
... [truncated]

## Implementation Plan summaries

_Detailed LLD lives in `.nexus/` per-cluster files and is read by_
_workers as needed; the summary below is for orchestration._

<!-- LLD :: LLD_xL2gZutUSpqYiFDElnbxVQ -->
{'markdown_string': '<!-- LLD generated via section-split flow -->\n\nThis LLD covers cluster_45111 (WriteSpace — Landing, Auth, Roles & Content Management), a fully holistic single-page blog application built with React 18+ and Vite. The cluster delivers three user stories: (1) a public landing page with hero, features, and latest posts preview for guest users (SCRUM-19985); (2) self-registration and login flows with hard-coded admin credentials and role-based redirects (SCRUM-19986); and (3) full CRUD on blog posts with ownership-based access control — regular users manage only their own posts while the Admin manages all posts — plus an admin dashboard with stats and a user management panel (SCRUM-19984). All data is persisted exclusively in localStorage (writespace_posts, writespace_users, writespace_session) with try/catch error handling and empty-array fallbacks. The UI uses inline Tailwind CSS utility classes exclusively, React Router v6 for client-side routing, and is deployable as a static site on Vercel via vercel.json rewrites. Key implementation choices include: a shallow component tree with no state management library (useState/useEffect only), role-distinct avatars exported as pure JSX from Avatar.jsx, a ProtectedRoute wrapper for guest-to-login and role-based redirects, and ownership enforcement handled within the WriteBlog and ReadBlog components themselves. No TypeScript, no backend, no encryption, no external auth libraries.\n\n## 1. Component Overview & Scope\n\n### 1.1 Purpose & Business Value\n\nWriteSpace is a fully holistic, single-page blog application that delivers three core user stories within a single React 18+ / Vite codebase:\n\n1. **Public Landing & Guest Browsing (SCRUM-19985)** — A guest-accessible landing page with hero, features, latest-posts preview, and footer, enabling zero-friction content discovery.\n2. **Self-Registration & Login (SCRUM-19986)** — A complete authentication flow supporting hard-coded admin credentials (`admin`/`admin`) and localStorage-stored user accounts, with role-based redirects (Admin → `/admin`, User → `/blogs`).\n3. **Blog CRUD with Ownership Enforcement (SCRUM-19984)** — Full create, read, update, delete on blog posts where regular users manage only their own posts while the Admin manages all posts, plus an admin dashboard with stats and a user management panel.\n\n**Business Value:** This cluster provides a deployable MVP of a blog application demonstrating core web patterns — authentication, authorization, CRUD, and role-based access control — without backend infrastructure. All data persists in localStorage, reducing deployment complexity and cost to zero. The role-based system enables clear demonstration of differentiated user experiences for stakeholder demos and UAT.\n\n### 1.2 Component Inventory Map\n\nThe cluster comprises **17 source files** organized into three layers:\n\n| Layer | File Path | Responsibility |\n|---|---|---|\n| **Entry** | `src/main.jsx` | React root mount, BrowserRouter wrapper, index.css import |\n| **Routing** | `src/App.jsx` | All `<Route>` definitions, conditional navbar rendering, ProtectedRoute wrapping |\n| **Utils** | `src/utils/storage.js` | localStorage CRUD for `writespace_posts`, `writespace_users` with try/catch + `[]` fallback |\n| **Utils** | `src/utils/auth.js` | Session read/write/clear for `writespace_session` |\n| **Components** | `src/components/Avatar.jsx` | Exports `getAvatar(role)` returning styled JSX (Admin: crown/violet, User: book/indigo) |\n| **Components** | `src/components/PublicNavbar.jsx` | Guest navbar with logo, login/register buttons, conditional avatar chip |\n| **Components** | `src/components/Navbar.jsx` | Authenticated navbar with role-based nav links, avatar chip dropdown, mobile hamburger |\n| **Components** | `src/components/ProtectedRoute.jsx` | Route guard: guest→`/login`; non-admin→`/blogs` when `role="admin"` prop set |\n| **Components** | `src/components/BlogCard.jsx` | Post card: title, excerpt (120 chars), date, author avatar, ownership-based edit icon |\n| **Components** | `src/components/StatCard.jsx` | Admin dashboard stat tile: number + label + colored icon background |\n| **Components** | `src/components/UserRow.jsx` | User table row / stacked card: avatar, details, role badge, delete button |\n| **Components** | `src/components/Footer.jsx` | Landing page footer: copyright, links to Home/All Blogs/Login/Register |\n| **Pages** | `src/pages/LandingPage.jsx` | Hero, features cards, latest posts preview, footer |\n| **Pages** | `src/pages/LoginPage.jsx` | Login form, hard-coded admin check, localStorage user check, session creation |\n| **Pages** | `src/pages/RegisterPage.jsx` | Registration form, username uniqueness, account creation, auto-login |\n| **Pages** | `src/pages/Home.jsx` | Blog list: responsive grid of BlogCards, empty state |\n| **Pages** | `src/pages/ReadBlog.jsx` | Full post view: title, author avatar, date, content, ownership-based edit/delete |\n| **Pages** | `src/pages/WriteBlog.jsx` | Create (`/write`) and edit (`/edit/:id`) form with ownership enforcement |\n| **Pages** | `src/pages/AdminDashboard.jsx` | Gradient header, stat cards, quick actions, recent posts |\n| **Pages** | `src/pages/UserManagement.jsx` | Create user form, user table/cards, delete with confirmation |\n\n[DIAGRAM_COMPONENT_MAP]\n\n### 1.3 In-Scope vs Out-of-Scope\n\n| Category | In Scope | Out of Scope |\n|---|---|---|\n| **Authentication** | Hard-coded admin (`admin`/`admin`), localStorage user accounts, session in `writespace_session` | OAuth, SSO, password hashing, encryption, forgot-password, email verification |\n| **Authorization** | Role-based route guards (ProtectedRoute), ownership enforcement in WriteBlog/ReadBlog | Fine-grained permissions, RBAC engine, audit logs |\n| **Content** | Blog posts with title, content, author, date; full CRUD with ownership rules | Rich text editor, image uploads, tags, categories, comments, likes |\n| **Data** | localStorage only (`writespace_posts`, `writespace_users`, `writespace_session`) | Backend, REST API, database, IndexedDB, cookies |\n| **UI** | Inline Tailwind utility classes, responsive breakpoints (mobile/tablet/desktop) | Custom CSS files, CSS modules, styled-components, CSS-in-JS libraries |\n| **State** | `useState` + `useEffect` only | Redux, Zustand, Jotai, Context API |\n| **Language** | JavaScript (`.jsx` for components, `.js` for utilities) | TypeScript (`.ts`, `.tsx` explicitly prohibited) |\n| **Deployment** | Static site on Vercel via `vercel.json` rewrites | Server-side rendering, API routes, serverless functions |\n| **Admin Features** | Dashboard with stats, user management (create/delete accounts) | Role editing, bulk operations, activity logs, analytics |\n\n### 1.4 Key Non-Functional Requirements\n\n| ID | Category | Target | Implementation Strategy |\n|---|---|---|---|\n| NFR-001 | Performance | Route transitions < 200ms | Vite HMR in dev; shallow component tree; no heavy libraries |\n| NFR-002 | Reliability | 100% direct URL access on Vercel | `vercel.json` with `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}` |\n| NFR-003 | Reliability | Zero crashes on localStorage failure | All reads wrapped in `try/catch` with `[]` fallback; graceful empty states |\n| NFR-004 | Simplicity | Zero `.ts`/`.tsx` files; zero custom CSS beyond `index.css` | Code review gate; `tailwind.config.js` content paths scoped to `.jsx` |\n| NFR-005 | Security (MVP) | Plain-text passwords documented | Code comment: `// WARNING: Plain-text storage — MVP only. Do not use real passwords.` |\n| NFR-006 | Responsiveness | Fully functional at <640px, 768px+, 1024px+ | Tailwind responsive prefixes: `sm:`, `md:`, `lg:` on all layout containers |\n| NFR-007 | Accessibility | All interactive elements focusable + ARIA labels | `focus:ring-*` on all buttons/links; `aria-label` on icon-only controls |\n\n### 1.5 Interface Contracts
