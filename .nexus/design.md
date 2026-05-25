# WriteSpace — Design System & Visual Standard (BINDING)

This is the single source of truth for HOW every UI file in the WriteSpace codebase must look and feel. Every worker reads this before writing markup, styles, or component code. The rules are concrete and measurable. When the LLD or PRD is silent on a visual decision, this file decides.

> Goal: ship interfaces that look like a senior designer made them on purpose — not interfaces that look like an LLM generated them by default.

---

## 0. Anti-Slop Manifesto

Default LLM output is generic, centred, purple-gradient, Inter on white, shadow-md, rounded-md, three-card grid. We do not ship that. Every screen must commit to a clear aesthetic direction (editorial, brutalist, high-end-agency, soft-luxury, industrial-utilitarian, etc.) and execute that direction with precision.

If a screen could belong to any AI-generated SaaS demo, it is wrong.

**WriteSpace's chosen direction:** **Modern Agency** — clean, confident, high-contrast. Geist for headings, Geist Mono for code/data. Indigo/violet/pink accent palette on warm stone neutrals. Generous whitespace. Sharp but not brutalist corners (`rounded-xl` for cards, `rounded-lg` for buttons). Motion is purposeful and restrained.

**Banned defaults (do not use unless PRD/design.md overrides explicitly):**

- `font-family: Inter, Roboto, Arial, system-ui` as the brand voice — WriteSpace uses Geist / Geist Mono
- purple-to-pink gradients on white backgrounds — WriteSpace uses indigo→violet→pink gradients ONLY on hero/auth backgrounds, never on content surfaces
- pure `#000` on pure `#fff` — use `stone-900` on `stone-50`
- centred card stack with three feature columns and a CTA at the bottom — WriteSpace uses editorial split, bento grid, or magazine layouts
- `bg-gradient-to-r from-purple-500 to-pink-500` — use `from-indigo-600 via-violet-600 to-pink-500` for hero/auth backgrounds only
- `rounded-md` everywhere — WriteSpace uses `rounded-xl` for cards, `rounded-lg` for buttons
- icon = emoji (🚀 ⚡ 🎨) — use Lucide SVG icons only; emoji is banned as structural icon
- "Get Started" buttons that are just `bg-blue-500 text-white` — use `bg-stone-900 text-stone-50` or accent variants
- placeholders used as the only label on inputs — always have a visible `<label>` above
- the same animation easing (`ease-in-out`) on everything — enter: `ease-out`, exit: `ease-in`, never `ease-in-out` as default

---

## 1. Typography (binding)

**Pairing rule:** Geist (display/heading) + Geist Mono (code/data). Never use a single font for everything.

**Font loading:** Google Fonts with `font-display: swap`. Import in `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
```

**Scale (Tailwind tokens — use these, not arbitrary values):**

| Role | Class | Use |
|---|---|---|
| Display | `text-6xl md:text-7xl font-semibold tracking-tighter` | hero h1 once per page |
| H1 | `text-4xl md:text-5xl font-semibold tracking-tight` | section headers |
| H2 | `text-2xl md:text-3xl font-semibold tracking-tight` | subsection |
| H3 | `text-xl font-medium` | card titles |
| Body L | `text-lg leading-relaxed` | hero subhead, intro |
| Body | `text-base leading-relaxed` | default |
| Body S | `text-sm leading-relaxed` | meta, captions |
| Mono | `font-mono text-sm tabular-nums` | code, data, prices |

**Weights:** display 600-700 with tight tracking (`tracking-tight` / `tracking-tighter`). Body 400. Labels 500. Never use 800/900 as default — they shout.

**Line length:** body prose `max-w-prose` or `max-w-[65ch]`. Never edge-to-edge paragraphs on desktop.

**Line height:** body `leading-relaxed` (1.625). Headings `leading-tight` (1.25). Never `leading-normal` (1.5) on display type.

**Numbers in data tables / prices / timers:** `tabular-nums` to stop column jitter.

**Tailwind config extension:**
```js
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

---

## 2. Colour (binding)

**Palette rule:** ONE expressive accent family (indigo/violet/pink) + ONE warm neutral family (stone) + small set of semantic tokens. Never invent ad-hoc hex values inside components.

**Neutrals:** Use `stone` warm scale. Pure `#fff` is too cold — use `stone-50` (`#FAFAF9`) for canvas and `stone-900` (`#1C1917`) for body text.

**Accent rule:** The accent family is indigo→violet→pink. Use sparingly — links, primary CTA, focus rings, key data points, hero gradients. If every button is the accent colour, the accent is dead.

**Contrast (non-negotiable):**

- Body text vs background: ≥ 4.5:1
- Large text (≥18pt or 14pt bold): ≥ 3:1
- Icons and disabled text: ≥ 3:1
- Focus ring vs adjacent surface: ≥ 3:1

**Semantic tokens** (declare in `index.css` as CSS custom properties; reference through tokens, never raw hex inside components):

```css
:root {
  --color-bg: #FAFAF9;          /* stone-50 */
  --color-surface: #FFFFFF;     /* white */
  --color-surface-2: #F5F5F4;  /* stone-100 */
  --color-text: #1C1917;       /* stone-900 */
  --color-text-muted: #78716C; /* stone-500 */
  --color-border: #E7E5E4;     /* stone-200 */
  --color-accent: #4F46E5;     /* indigo-600 */
  --color-accent-fg: #FFFFFF;  /* white on accent */
  --color-success: #059669;    /* emerald-600 */
  --color-warning: #D97706;    /* amber-600 */
  --color-danger: #DC2626;     /* red-600 */
  --color-focus: #6366F1;      /* indigo-500 */
}
```

**Dark mode:** Design light/dark together. Dark mode is NOT inverted light mode — desaturate, drop one tonal step on surfaces, keep accent hue but reduce saturation 10-15%. Test contrast independently.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1C1917;       /* stone-900 */
    --color-surface: #292524;  /* stone-800 */
    --color-surface-2: #44403C;/* stone-700 */
    --color-text: #FAFAF9;     /* stone-50 */
    --color-text-muted: #A8A29E;/* stone-400 */
    --color-border: #57534E;   /* stone-600 */
    --color-accent: #818CF8;   /* indigo-400 (desaturated) */
    --color-accent-fg: #1C1917;
    --color-focus: #818CF8;
  }
}
```

**Functional colour must never be the only signal.** Error rows also get an icon + label. Success states also get a check icon. Colour-blind users exist.

**WriteSpace-specific palette usage:**

| Element | Token | Tailwind Class |
|---|---|---|
| Hero/auth gradient background | — | `bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500` |
| Canvas (page background) | `--color-bg` | `bg-stone-50` |
| Card surface | `--color-surface` | `bg-white` |
| Body text | `--color-text` | `text-stone-900` |
| Muted text | `--color-text-muted` | `text-stone-500` |
| Borders / dividers | `--color-border` | `ring-1 ring-stone-200` |
| Primary CTA | `--color-accent` | `bg-indigo-600 text-white hover:bg-indigo-700` |
| Secondary CTA | — | `bg-stone-900 text-stone-50 hover:bg-stone-800` |
| Danger / delete | `--color-danger` | `bg-red-600 text-white hover:bg-red-700` |
| Focus ring | `--color-focus` | `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2` |
| Admin avatar | — | `bg-violet-600` |
| User avatar | — | `bg-indigo-500` |
| Blog card accent (cycling) | — | `border-t-4 border-indigo-500` / `border-violet-500` / `border-pink-500` / `border-teal-500` |

---

## 3. Spacing & Layout (binding)

**8-pt rhythm.** All padding, gap, margin step in 4px / 8px units. Use Tailwind's spacing scale (`p-4`, `gap-6`, `py-16`) — never raw `px`.

**Section spacing tiers** (pick a tier and stick to it within the page):

| Tier | Token | Use |
|---|---|---|
| Tight | `space-y-3` / `gap-3` | inside cards, inline meta |
| Default | `space-y-6` / `gap-6` | between paragraphs, list items |
| Section | `space-y-12 py-16 md:py-24` | between top-level sections |
| Hero | `py-24 md:py-32 lg:py-40` | landing hero, only once |

**Generous default.** When in doubt, add MORE space. Cramped is the #1 signal of generic AI output.

**Container width:** `max-w-6xl px-6 mx-auto` for content. `max-w-7xl` for dashboards. Never edge-to-edge text on desktop.

**Layout patterns to prefer over centred-card-on-white:**

1. **Editorial split** — large display text left, body + CTA right, asymmetric column widths (e.g. `grid-cols-12` with `col-span-7` / `col-span-5`). Used on LandingPage hero.
2. **Bento grid** — uneven tiles, 2-3 visual weights per row, varies density. Tailwind `grid-cols-6` with `col-span-{2,3,4}` mixes. Used on AdminDashboard stats.
3. **Hero + sidebar** — dashboard pattern with persistent left nav, content takes the rest. Used on authenticated pages.
4. **Sticky aside** — long-form content with `sticky top-24` table of contents on the right.
5. **Magazine** — asymmetric overlap, oversized headings break the grid, small caption text on the margin.

**Banned layouts:** centred stack with three identical feature cards under a hero. Use it only if PRD explicitly demands it.

**WriteSpace-specific layout recipes:**

```jsx
// LandingPage hero — editorial split
<section className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500">
  <div className="max-w-6xl px-6 mx-auto py-24 md:py-32 lg:py-40">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7">
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter text-white">
          WriteSpace
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-white/80 mt-6 max-w-prose">
          Your thoughts. Your space. Beautifully simple.
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
          {/* CTA buttons */}
        </div>
      </div>
      <div className="lg:col-span-5">
        {/* Floating card animation */}
      </div>
    </div>
  </div>
</section>

// Blog list — responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* BlogCard components */}
</div>

// Admin dashboard — bento grid
<div className="grid grid-cols-6 gap-6">
  <div className="col-span-6 md:col-span-3 lg:col-span-2">
    <StatCard />
  </div>
  <div className="col-span-6 md:col-span-3 lg:col-span-2">
    <StatCard />
  </div>
  <div className="col-span-6 md:col-span-3 lg:col-span-2">
    <StatCard />
  </div>
  <div className="col-span-6 lg:col-span-4">
    {/* Recent posts table */}
  </div>
  <div className="col-span-6 lg:col-span-2">
    {/* Quick actions */}
  </div>
</div>
```

---

## 4. Components (binding)

**Corner radius identity:** WriteSpace uses **Modern Agency** radius:
- Cards: `rounded-xl`
- Buttons: `rounded-lg`
- Inputs: `rounded-lg`
- Modals: `rounded-xl`
- Avatar chips: `rounded-full`

Never mix `rounded-md` cards with `rounded-2xl` buttons — that's tell #1.

**Shadow scale** (declare 3 levels max, use consistently):

| Level | Class | Use |
|---|---|---|
| Flat | `shadow-none ring-1 ring-stone-200` | default cards |
| Lift | `shadow-lg hover:shadow-xl transition-shadow` | interactive cards, blog cards |
| Modal | `shadow-2xl` | dialogs, popovers |

**Borders / rings:** prefer `ring-1 ring-stone-200/80` over heavy `border-2 border-gray-300`. Hairline rings read more refined.

### 4.1 Buttons

```jsx
// Primary CTA (indigo accent)
<button className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white
                   hover:bg-indigo-700 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-indigo-500
                   focus-visible:ring-offset-2 transition-colors duration-200
                   text-sm font-medium cursor-pointer
                   active:scale-[0.97] transition-transform duration-100
                   disabled:opacity-50 disabled:cursor-not-allowed">
  {loading ? (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Loading...
    </span>
  ) : 'Continue'}
</button>

// Secondary CTA (stone dark)
<button className="px-5 py-2.5 rounded-lg bg-stone-900 text-stone-50
                   hover:bg-stone-800 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-stone-900
                   focus-visible:ring-offset-2 transition-colors duration-200
                   text-sm font-medium cursor-pointer
                   active:scale-[0.97] transition-transform duration-100
                   disabled:opacity-50 disabled:cursor-not-allowed">
  Get Started Free
</button>

// Ghost / Cancel button
<button className="px-5 py-2.5 rounded-lg ring-1 ring-stone-300
                   bg-white hover:bg-stone-50 text-stone-900
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-stone-900 focus-visible:ring-offset-2
                   transition-colors duration-200 text-sm font-medium cursor-pointer
                   active:scale-[0.97] transition-transform duration-100">
  Cancel
</button>

// Danger / Delete button
<button className="px-5 py-2.5 rounded-lg bg-red-600 text-white
                   hover:bg-red-700 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-red-500
                   focus-visible:ring-offset-2 transition-colors duration-200
                   text-sm font-medium cursor-pointer
                   active:scale-[0.97] transition-transform duration-100">
  Delete
</button>

// Icon-only button (e.g., edit pencil)
<button className="p-2 rounded-lg text-stone-500 hover:text-stone-900
                   hover:bg-stone-100 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-indigo-500
                   focus-visible:ring-offset-2 transition-colors duration-200
                   cursor-pointer"
        aria-label="Edit post">
  <svg className="w-5 h-5" ... />
</button>
```

- min touch target 44×44px (use `py-2.5` minimum on mobile)
- `cursor-pointer` on every clickable
- visible focus ring on EVERY interactive element (`focus-visible:ring-2`)
- disabled = `opacity-50 cursor-not-allowed` + `aria-disabled="true"`
- loading state = spinner + disabled, never hide the button label

### 4.2 Inputs

```jsx
<div className="space-y-1.5">
  <label htmlFor="username" className="text-sm font-medium text-stone-900">
    Username
  </label>
  <input
    id="username"
    type="text"
    className="w-full px-4 py-2.5 rounded-lg ring-1 ring-stone-300
               bg-white text-stone-900 placeholder:text-stone-400
               focus:outline-none focus:ring-2 focus:ring-indigo-500
               focus:ring-offset-0 transition-all duration-200
               text-base leading-relaxed
               disabled:opacity-50 disabled:cursor-not-allowed"
    placeholder="Enter your username"
    aria-describedby="username-helper"
  />
  <p id="username-helper" className="text-sm text-stone-500">
    Must be unique across all users
  </p>
</div>

// Error state
<div className="space-y-1.5">
  <label htmlFor="password" className="text-sm font-medium text-stone-900">
    Password
  </label>
  <input
    id="password"
    type="password"
    className="w-full px-4 py-2.5 rounded-lg ring-1 ring-red-500
               bg-white text-stone-900 placeholder:text-stone-400
               focus:outline-none focus:ring-2 focus:ring-red-500
               focus:ring-offset-0 transition-all duration-200
               text-base leading-relaxed"
    aria-invalid="true"
    aria-describedby="password-error"
  />
  <p id="password-error" className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
    <svg className="w-4 h-4" ... /> {/* Lucide AlertCircle */}
    Password must be at least 6 characters
  </p>
</div>

// Textarea (for blog content)
<textarea
  className="w-full px-4 py-3 rounded-lg ring-1 ring-stone-300
             bg-white text-stone-900 placeholder:text-stone-400
             focus:outline-none focus:ring-2 focus:ring-indigo-500
             focus:ring-offset-0 transition-all duration-200
             text-base leading-relaxed resize-y min-h-[256px]"
  rows={12}
/>
```

- visible label above input (placeholder is NOT a label)
- helper text persistent under input, not just placeholder
- error message below the field, in `text-red-600` + icon
- inline validation on blur, never keystroke
- mobile input height ≥ 44px
- semantic `type=` (email/tel/number) for correct mobile keyboard

### 4.3 Cards

```jsx
// Blog card
<article className="rounded-xl bg-white p-6 md:p-8
                    ring-1 ring-stone-200
                    hover:ring-stone-300 hover:shadow-lg
                    transition-all duration-200
                    hover:-translate-y-0.5
                    cursor-pointer">
  <div className={`h-1 -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-4 rounded-t-xl
                   ${accentColors[index % 4]}`} />
  <h3 className="text-xl font-medium text-stone-900 line-clamp-2">
    {post.title}
  </h3>
  <p className="text-base leading-relaxed text-stone-600 mt-2 line-clamp-3">
    {post.excerpt}
  </p>
  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
    <div className="flex items-center gap-2">
      {getAvatar(post.authorRole)}
      <span className="text-sm text-stone-500">{post.authorName}</span>
    </div>
    <time className="text-sm text-stone-400 tabular-nums">
      {formatDate(post.createdAt)}
    </time>
  </div>
</article>

// Stat card (admin dashboard)
<div className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
  <div className="flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                     ${iconBgColor}`}>
      {/* Lucide icon */}
    </div>
    <div>
      <p className="text-3xl font-semibold text-stone-900 tabular-nums">
        {count}
      </p>
      <p className="text-sm text-stone-500">{label}</p>
    </div>
  </div>
</div>
```

### 4.4 Modals / Dialogs

```jsx
// Backdrop
<div className="fixed inset-0 z-50 flex items-center justify-center p-4
                bg-black/40 backdrop-blur-sm"
     onClick={onClose}>

  {/* Modal panel */}
  <div className="rounded-xl bg-white p-6 md:p-8 shadow-2xl
                  max-w-md w-full mx-auto
                  animate-in fade-in zoom-in-95 duration-200 ease-out"
       onClick={e => e.stopPropagation()}>

    <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
      Confirm Delete
    </h2>
    <p className="text-base leading-relaxed text-stone-600 mt-2">
      Are you sure you want to delete this post? This action cannot be undone.
    </p>
    <div className="flex justify-end gap-3 mt-6">
      <button className="px-4 py-2 rounded-lg ring-1 ring-stone-300
                         bg-white hover:bg-stone-50 text-stone-900
                         text-sm font-medium transition-colors duration-200">
        Cancel
      </button>
      <button className="px-4 py-2 rounded-lg bg-red-600 text-white
                         hover:bg-red-700 text-sm font-medium
                         transition-colors duration-200">
        Delete
      </button>
    </div>
  </div>
</div>
```

### 4.5 Toast / Notification

```jsx
// Success toast
<div className="fixed bottom-6 right-6 z-50
                rounded-xl bg-emerald-600 text-white px-5 py-3
                shadow-lg flex items-center gap-3
                animate-in slide-in-from-right-4 duration-300 ease-out
                aria-live="polite">
  <svg className="w-5 h-5 flex-shrink-0" ... /> {/* Lucide CheckCircle2 */}
  <p className="text-sm font-medium">Post published successfully!</p>
  <button className="ml-2 text-white/80 hover:text-white" aria-label="Dismiss">
    <svg className="w-4 h-4" ... /> {/* Lucide X */}
  </button>
</div>

// Error toast
<div className="fixed bottom-6 right-6 z-50
                rounded-xl bg-red-600 text-white px-5 py-3
                shadow-lg flex items-center gap-3
                animate-in slide-in-from-right-4 duration-300 ease-out
                aria-live="assertive">
  <svg className="w-5 h-5 flex-shrink-0" ... /> {/* Lucide AlertTriangle */}
  <p className="text-sm font-medium">Failed to save post. Please try again.</p>
  <button className="ml-2 text-white/80 hover:text-white" aria-label="Dismiss">
    <svg className="w-4 h-4" ... />
  </button>
</div>
```

### 4.6 Skeleton / Loading

```jsx
// Blog card skeleton
<div className="rounded-xl bg-white p-6 md:p-8 ring-1 ring-stone-200 animate-pulse">
  <div className="h-1 -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-4 rounded-t-xl bg-stone-200" />
  <div className="h-6 bg-stone-200 rounded w-3/4" />
  <div className="space-y-2 mt-3">
    <div className="h-4 bg-stone-200 rounded w-full" />
    <div className="h-4 bg-stone-200 rounded w-5/6" />
  </div>
  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-stone-200" />
      <div className="h-4 bg-stone-200 rounded w-20" />
    </div>
    <div className="h-4 bg-stone-200 rounded w-16" />
  </div>
</div>

// Skeleton shimmer overlay (add to animate-pulse containers)
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                -translate-x-full animate-shimmer" />
```

### 4.7 Avatar System

```jsx
// Avatar.jsx — exported as getAvatar(role)
export function getAvatar(role, size = 'md') {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-2xl',
  };

  const isAdmin = role === 'admin';
  const bgClass = isAdmin ? 'bg-violet-600' : 'bg-indigo-500';
  const emoji = isAdmin ? '👑' : '📖';

  return (
    <div className={`${sizeClasses[size] || sizeClasses.md} ${bgClass}
                    rounded-full flex items-center justify-center
                    text-white font-semibold select-none`}
         aria-label={isAdmin ? 'Admin avatar' : 'User avatar'}>
      <span className="leading-none">{emoji}</span>
    </div>
  );
}
```

### 4.8 Navbar (Authenticated)

```jsx
<nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm
                border-b border-stone-200 shadow-sm">
  <div className="max-w-7xl px-6 mx-auto">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Link to="/" className="text-xl font-semibold tracking-tight text-stone-900">
        WriteSpace
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-1">
        <NavLink to="/blogs" className={({isActive}) =>
          `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
           ${isActive ? 'bg-indigo-600 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`
        }>
          All Blogs
        </NavLink>
        <NavLink to="/write" className={...}>
          Write
        </NavLink>
        {session.role === 'admin' && (
          <NavLink to="/admin" className={...}>
            Dashboard
          </NavLink>
        )}
        {session.role === 'admin' && (
          <NavLink to="/users" className={...}>
            Users
          </NavLink>
        )}
      </div>

      {/* Avatar chip + dropdown */}
      <div className="relative">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                           hover:bg-stone-100 transition-colors duration-200
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-indigo-500"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}>
          {getAvatar(session.role, 'sm')}
          <span className="text-sm font-medium text-stone-900 hidden sm:inline">
            {session.displayName}
          </span>
          <svg className="w-4 h-4 text-stone-400" ... /> {/* ChevronDown */}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white
                          ring-1 ring-stone-200 shadow-lg py-1 z-50
                          animate-in fade-in zoom-in-95 duration-150 ease-out">
            <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-stone-700
                               hover:bg-stone-50 transition-colors duration-150">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden p-2 rounded-lg text-stone-600
                         hover:bg-stone-100 transition-colors duration-200
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-indigo-500"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu">
        <svg className="w-6 h-6" ... /> {/* Lucide Menu */}
      </button>
    </div>

    {/* Mobile menu panel */}
    {mobileOpen && (
      <div className="md:hidden pb-4 border-t border-stone-100 pt-2
                      animate-in slide-in-from-top-2 duration-200 ease-out">
        <NavLink to="/blogs" className={...}>All Blogs</NavLink>
        <NavLink to="/write" className={...}>Write</NavLink>
        {session.role === 'admin' && (
          <NavLink to="/admin" className={...}>Dashboard</NavLink>
        )}
        {session.role === 'admin' && (
          <NavLink to="/users" className={...}>Users</NavLink>
        )}
      </div>
    )}
  </div>
</nav>
```

### 4.9 Footer

```jsx
<footer className="bg-stone-900 text-stone-300 py-12 md:py-16">
  <div className="max-w-6xl px-6 mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-white">WriteSpace</h3>
        <p className="text-sm leading-relaxed text-stone-400 mt-2 max-w-prose">
          Your thoughts. Your space. Beautifully simple.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Links</h4>
        <ul className="space-y-2">
          <li><Link to="/" className="text-sm text-stone-400 hover:text-white transition-colors">Home</Link></li>
          <li><Link to="/blogs" className="text-sm text-stone-400 hover:text-white transition-colors">All Blogs</Link></li>
          <li><Link to="/login" className="text-sm text-stone-400 hover:text-white transition-colors">Login</Link></li>
          <li><Link to="/register" className="text-sm text-stone-400 hover:text-white transition-colors">Register</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-sm text-stone-500">
          &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>
```

---

## 5. Motion (binding)

**Durations:** micro 150-200ms, normal 200-300ms, complex 300-400ms. Never > 500ms.

**Easing:**
- enter / reveal: `ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)` for spring feel)
- exit / dismiss: `ease-in` (faster — exit ≈ 60-70% of enter duration)
- never `linear` on UI transitions
- never `ease-in-out` as the default (it's the LLM-default tell)

**Property rule:** animate `transform` and `opacity` ONLY. Never `width` / `height` / `top` / `left` — they cause reflow and jank.

**Hover:** subtle. `hover:scale-[1.02]` on cards, `hover:shadow-lg` transition, colour shift on buttons. Never bouncy or cartoonish.

**Stagger:** list/grid entrances stagger 30-50ms per item. Use `animation-delay` or inline style with `--stagger-index`.

**Reduced motion:** wrap every animation with `@media (prefers-reduced-motion: reduce)` → instant transitions, no parallax. Tailwind has `motion-reduce:` variant — use it.

**No blocking animation.** User can always click through; animation never holds input.

**Page load:** one orchestrated reveal beats scattered micro-interactions. Stagger the hero in 3-4 phases on first paint.

### 5.1 Premier Motion — small touches that earn their wage

These are the little, unobvious animations that separate "shipped" from "premium". Use them — they are cheap, low-risk, and add perceived quality.

- **Button press scale.** `active:scale-[0.97] transition-transform duration-100` on every primary button. The pressed state should *feel* pressed, not just look pressed.
- **Card lift on hover.** `transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl`. Subtle vertical lift > naive shadow change.
- **Image / hero ken-burns.** On the hero image, slow `scale(1) → scale(1.04)` over 8-12s with `ease-out`. Brings static photography to life.
- **Number count-up.** Dashboard stat cards count from `0 → final` over ~600ms on first paint (use `useEffect` + `requestAnimationFrame`).
- **Skeleton shimmer.** Loading skeletons get a left-to-right gradient `animate-pulse` PLUS a slow shimmer overlay — feels alive, not frozen.
- **Reveal-on-scroll.** Section enters with `opacity-0 translate-y-4 → opacity-100 translate-y-0` once it crosses viewport. Use `IntersectionObserver` or inline `useEffect`. Stagger 50ms per child.
- **Underline grow on link hover.** `bg-gradient` underline expands from left or center — never the default `underline` toggle.
- **Magnetic CTA.** Buttons on landing/marketing pages tilt 2-4° toward the cursor. (Optional — use `onPointerMove` with `useState`.)
- **Carousel/tab indicator.** Active tab underline / dot SLIDES between positions instead of fading in-out.
- **Toast slide-in.** Toasts enter from the right edge with `slide-in-from-right-4 duration-300 ease-out`, exit faster with `ease-in`.
- **Modal scale-from-trigger.** Modals scale from `0.96 → 1` + fade. Backdrop fades to 40% black at the same time.
- **Input focus halo.** `focus:ring-2 ring-indigo-500/40` with a 200ms transition. Plus a 1px border colour shift. Tells the user where they are.
- **Disabled crossfade.** When a button toggles disabled, opacity slides `1 → 0.5` over 150ms — never an instant snap.
- **Form field error shake.** On submit error, the invalid input does a 4-frame `translateX(-4, 4, -4, 0)` over 200ms. One per submit, not loop.
- **Checkbox / toggle spring.** Checkbox tick draws in (SVG `stroke-dashoffset` 0→100), toggle thumb springs across the track. Native HTML checkboxes are tell #2 of generic AI UI.
- **Drag affordance.** When draggable, item lifts (`scale-[1.02] shadow-2xl`) on `pointerdown`, drops back smoothly on release.
- **Route transitions.** Page navigation crossfades content + slides 8px in the navigation direction. 250ms. Never a hard cut.
- **Cursor follower (optional).** On landing / portfolio sites, a small accent-colour dot follows the cursor with `lerp` smoothing — scales up on interactive hover. Tasteful, not gimmicky.
- **Marquee / text scroll.** Long pill rows of logos / categories move horizontally on a slow infinite loop. Pauses on hover.
- **Chart bar grow-in.** Bar charts animate `height: 0 → final` on first paint with 50ms stagger. Lines draw with `stroke-dasharray`.
- **Theme toggle morph.** Sun/moon icon rotates and morphs (SVG `transition-transform rotate-180`) on theme switch.

**Respect reduced-motion.** Wrap every entry above in `motion-reduce:transition-none motion-reduce:transform-none` or equivalent. Honour the user, or be inaccessible.

**Tailwind animation utilities to add in `tailwind.config.js`:**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-4px)' },
        },
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.2s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'shake': 'shake 0.2s ease-in-out',
      },
    },
  },
}
```

---

## 6. States (binding — never skip)

Every component that fetches or computes data MUST handle four states. A blank screen during load is a bug.

| State | What to render |
|---|---|
| **Loading** | Skeleton with same shape as final content (not a centred spinner). For ≤300ms operations, no spinner at all. |
| **Empty** | Friendly heading + one-line explanation + primary CTA to populate. Never an empty `<div>`. |
| **Error** | Heading naming the failure + retry action + secondary "help" link. Never just "Error". |
| **Success** | Inline confirmation (toast / check icon / colour flash). Auto-dismiss in 3-5s. |

Toasts: `aria-live="polite"`, never steal focus.

**WriteSpace-specific state examples:**

```jsx
// Loading state — Blog list
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map(i => <BlogCardSkeleton key={i} />)}
  </div>
) : null}

// Empty state — Blog list
{posts.length === 0 && !loading && (
  <div className="text-center py-16">
    <svg className="w-16 h-16 mx-auto text-stone-300" ... /> {/* Lucide FileText */}
    <h2 className="text-2xl font-semibold text-stone-900 mt-4">No blogs yet</h2>
    <p className="text-base text-stone-500 mt-2">Be the first to write one!</p>
    <Link to="/write"
          className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 text-white
                     hover:bg-indigo-700 text-sm font-medium transition-colors duration-200">
      Write Your First Post
    </Link>
  </div>
)}

// Error state — Blog list
{error && (
  <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
    <svg className="w-12 h-12 mx-auto text-red-400" ... /> {/* Lucide AlertTriangle */}
    <h2 className="text-xl font-semibold text-red-800 mt-3">Failed to load posts</h2>
    <p className="text-sm text-red-600 mt-1">Something went wrong. Please try again.</p>
    <button onClick={retry}
            className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white
                       hover:bg-red-700 text-sm font-medium transition-colors duration-200">
      Try Again
    </button>
  </div>
)}

// Success state — after creating a post
// (Toast notification, auto-dismiss after 4 seconds)
```

---

## 7. Accessibility (binding — non-negotiable)

- semantic HTML: `<button>` for buttons, `<a>` for links, `<nav>` for nav, `<main>` for main content. Never `<div onClick>`.
- every icon-only button has `aria-label`.
- focus ring visible on EVERY interactive element. Removing it is a bug.
- tab order matches visual order. Test with keyboard only.
- heading hierarchy sequential: h1 → h2 → h3. No skipping.
- form errors use `role="alert"` or `aria-live`.
- after submit error, focus the first invalid field.
- support `prefers-reduced-motion` and dynamic text scaling.
- colour is never the only signal — pair with icon or text.

**WriteSpace-specific accessibility checklist:**

- [ ] All `<button>` elements have `cursor-pointer`
- [ ] All icon-only buttons have `aria-label`
- [ ] All form inputs have associated `<label>` with `htmlFor`
- [ ] All error messages use `role="alert"`
- [ ] All toasts use `aria-live="polite"` (or `"assertive"` for errors)
- [ ] All interactive elements have `focus-visible:ring-2`
- [ ] All images / avatar containers have `aria-label` or `alt`
- [ ] All navigation has `<nav>` landmark
- [ ] All page content is inside `<main>`
- [ ] Heading levels are sequential (h1 → h2 → h3)
- [ ] Colour is never the only signal (error = red + icon, success = green + icon)

---

## 8. Responsive (binding)

**Breakpoints** (Tailwind defaults — do not invent new ones):

| Token | Width | Target |
|---|---|---|
| (default) | 0 | mobile portrait |
| `sm:` | 640 | large phone landscape |
| `md:` | 768 | tablet |
| `lg:` | 1024 | small laptop |
| `xl:` | 1280 | desktop |
| `2xl:` | 1536 | large desktop |

**Mobile-first.** Write the mobile rule first, scale up. Never `md:hidden` to hide critical content.

**No horizontal scroll on mobile.** Test at 375px width.

**Container gutters** widen with breakpoint: `px-4 md:px-6 lg:px-8`.

**Hero text shrinks**: `text-4xl md:text-5xl lg:text-7xl` (do not pin display sizes at one value).

**WriteSpace-specific responsive patterns:**

```jsx
// Blog grid: 1 col mobile → 2 col tablet → 3 col desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {posts.map(post => <BlogCard key={post.id} post={post} />)}
</div>

// Feature cards: 1 col mobile → 3 col desktop
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {features.map(f => <FeatureCard key={f.title} {...f} />)}
</div>

// Admin dashboard: stacked mobile → bento desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
  <StatCard className="md:col-span-1 lg:col-span-2" />
  <StatCard className="md:col-span-1 lg:col-span-2" />
  <StatCard className="md:col-span-1 lg:col-span-2" />
  <div className="md:col-span-2 lg:col-span-4">{/* Recent posts */}</div>
  <div className="md:col-span-2 lg:col-span-2">{/* Quick actions */}</div>
</div>

// Navbar: hamburger on mobile, full links on desktop
<nav>
  {/* Desktop nav — hidden on mobile */}
  <div className="hidden md:flex items-center gap-1">
    <NavLink to="/blogs">All Blogs</NavLink>
    <NavLink to="/write">Write</NavLink>
  </div>

  {/* Mobile hamburger — visible on mobile */}
  <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Menu">
    <svg className="w-6 h-6" ... />
  </button>
</nav>

// Hero: stacked mobile → editorial split desktop
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
  <div className="lg:col-span-7">{/* Text */}</div>
  <div className="lg:col-span-5">{/* Visual */}</div>
</div>
```

---

## 9. Final Acceptance Checklist (every worker self-checks)

Before calling `complete_job`, the worker confirms:

- [ ] no banned default in the file (see §0)
- [ ] typography pair declared (Geist + Geist Mono), scale uses tokens
- [ ] palette uses semantic tokens, no raw hex in component
- [ ] contrast checked (body ≥ 4.5:1, icons ≥ 3:1)
- [ ] 8pt spacing rhythm, no random `gap-[7px]`
- [ ] corner-radius identity consistent (rounded-xl cards, rounded-lg buttons)
- [ ] focus ring on every interactive (`focus-visible:ring-2`)
- [ ] all four states handled if fetching data (loading/empty/error/success)
- [ ] touch targets ≥ 44px on mobile
- [ ] motion uses transform/opacity only, ≤ 400ms, honours `motion-reduce`
- [ ] no emoji as structural icon (emoji only in avatar component)
- [ ] tested mental render at 375px and at desktop
- [ ] all forms have visible labels (placeholder is NOT a label)
- [ ] all icon-only buttons have `aria-label`
- [ ] all error messages use `role="alert"`
- [ ] all toasts use `aria-live="polite"` or `"assertive"`
- [ ] heading hierarchy is sequential (h1 → h2 → h3)
- [ ] colour is never the only signal (paired with icon or text)
- [ ] all localStorage reads wrapped in try/catch with fallback
- [ ] all interactive elements have `cursor-pointer`
- [ ] disabled buttons have `opacity-50 cursor-not-allowed`
- [ ] loading state shows skeleton, not centred spinner (for >300ms ops)

If any item fails, fix before completing.

---

*This file is the single source of truth for WriteSpace's visual design. Every worker reads it before writing markup, styles, or component code. The rules are concrete and measurable. When the LLD or PRD is silent on a visual decision, this file decides.*

# Craft — Design Quality Standard (BINDING)

This is the single source of truth for HOW every UI file in this codebase
must look and feel. Every worker reads this before writing markup, styles,
or component code. The rules are concrete and measurable. When the LLD or
PRD is silent on a visual decision, this file decides.

> Goal: ship interfaces that look like a senior designer made them on
> purpose — not interfaces that look like an LLM generated them by default.

---

## 0. Anti-Slop Manifesto

Default LLM output is generic, centred, purple-gradient, Inter on white,
shadow-md, rounded-md, three-card grid. We do not ship that. Every screen
must commit to a clear aesthetic direction (editorial, brutalist,
high-end-agency, soft-luxury, industrial-utilitarian, etc.) and execute
that direction with precision.

If a screen could belong to any AI-generated SaaS demo, it is wrong.

**Banned defaults (do not use unless PRD/design.md overrides explicitly):**

- `font-family: Inter, Roboto, Arial, system-ui` as the brand voice
- purple-to-pink gradients on white backgrounds
- pure `#000` on pure `#fff`
- centred card stack with three feature columns and a CTA at the bottom
- `bg-gradient-to-r from-purple-500 to-pink-500`
- `rounded-md` everywhere
- icon = emoji (🚀 ⚡ 🎨)
- "Get Started" buttons that are just `bg-blue-500 text-white`
- placeholders used as the only label on inputs
- the same animation easing (`ease-in-out`) on everything

---

## 1. Typography (binding)

**Pairing rule:** one display/serif/expressive heading face + one calm
sans body face. Never use a single font for everything.

**Scale (Tailwind tokens — use these, not arbitrary values):**

| Role | Class | Use |
|---|---|---|
| Display | `text-6xl md:text-7xl` | hero h1 once per page |
| H1 | `text-4xl md:text-5xl` | section headers |
| H2 | `text-2xl md:text-3xl` | subsection |
| H3 | `text-xl` | card titles |
| Body L | `text-lg leading-relaxed` | hero subhead, intro |
| Body | `text-base leading-relaxed` | default |
| Body S | `text-sm leading-relaxed` | meta, captions |
| Mono | `font-mono text-sm` | code, data, prices |

**Weights:** display 600-700 with tight tracking (`tracking-tight` /
`tracking-tighter`). Body 400. Labels 500. Never use 800/900 as
default — they shout.

**Line length:** body prose `max-w-prose` or `max-w-[65ch]`. Never
edge-to-edge paragraphs on desktop.

**Line height:** body `leading-relaxed` (1.625). Headings `leading-tight`
(1.25). Never `leading-normal` (1.5) on display type.

**Numbers in data tables / prices / timers:** `tabular-nums` to stop
column jitter.

**Suggested font families** (pick ONE pairing per project, declare in
design.md or the global stylesheet):

- *Editorial* — Fraunces / Söhne (or Inter Tight as cheap fallback)
- *Modern Agency* — Geist / Geist Mono
- *Soft Luxury* — Cormorant Garamond / Manrope
- *Industrial* — Space Grotesk / JetBrains Mono *(use sparingly — overused)*
- *Brutalist* — Archivo Black / IBM Plex Mono

Use Google Fonts or self-host. Add `font-display: swap`.

---

## 2. Colour (binding)

**Palette rule:** ONE expressive accent + ONE warm neutral family +
small set of semantic tokens. Never invent ad-hoc hex values inside
components.

**Neutrals:** prefer `stone` / `slate` / `zinc` warm scales over Tailwind's
default `gray`. Pure `#fff` is too cold — use `stone-50` (`#FAFAF9`) for
canvas and `stone-900` (`#1C1917`) for body text.

**Accent rule:** pick ONE accent hue that carries the brand. Use it
sparingly — links, primary CTA, focus rings, key data points. If every
button is the accent colour, the accent is dead.

**Contrast (non-negotiable):**

- Body text vs background: ≥ 4.5:1
- Large text (≥18pt or 14pt bold): ≥ 3:1
- Icons and disabled text: ≥ 3:1
- Focus ring vs adjacent surface: ≥ 3:1

**Semantic tokens** (declare in tailwind.config or CSS vars; reference
through tokens, never raw hex inside components):

```
--color-bg          (canvas)
--color-surface     (cards, panels)
--color-surface-2   (elevated)
--color-text        (body)
--color-text-muted  (secondary)
--color-border      (dividers)
--color-accent      (primary CTA, links)
--color-accent-fg   (text on accent)
--color-success
--color-warning
--color-danger
--color-focus       (focus ring)
```

**Dark mode:** design light/dark together. Dark mode is NOT inverted
light mode — desaturate, drop one tonal step on surfaces, keep accent
hue but reduce saturation 10-15%. Test contrast independently.

**Functional colour must never be the only signal.** Error rows also
get an icon + label. Success states also get a check icon. Colour-blind
users exist.

---

## 3. Spacing & Layout (binding)

**8-pt rhythm.** All padding, gap, margin step in 4px / 8px units.
Use Tailwind's spacing scale (`p-4`, `gap-6`, `py-16`) — never raw `px`.

**Section spacing tiers** (pick a tier and stick to it within the page):

| Tier | Token | Use |
|---|---|---|
| Tight | `space-y-3` / `gap-3` | inside cards, inline meta |
| Default | `space-y-6` / `gap-6` | between paragraphs, list items |
| Section | `space-y-12 py-16 md:py-24` | between top-level sections |
| Hero | `py-24 md:py-32 lg:py-40` | landing hero, only once |

**Generous default.** When in doubt, add MORE space. Cramped is the #1
signal of generic AI output.

**Container width:** `max-w-6xl px-6 mx-auto` for content. `max-w-7xl`
for dashboards. Never edge-to-edge text on desktop.

**Layout patterns to prefer over centred-card-on-white:**

1. **Editorial split** — large display text left, body + CTA right,
   asymmetric column widths (e.g. `grid-cols-12` with `col-span-7` / `col-span-5`).
2. **Bento grid** — uneven tiles, 2-3 visual weights per row, varies
   density. Tailwind `grid-cols-6` with `col-span-{2,3,4}` mixes.
3. **Hero + sidebar** — dashboard pattern with persistent left nav,
   content takes the rest.
4. **Sticky aside** — long-form content with `sticky top-24` table of
   contents on the right.
5. **Magazine** — asymmetric overlap, oversized headings break the grid,
   small caption text on the margin.

**Banned layouts:** centred stack with three identical feature cards
under a hero. Use it only if PRD explicitly demands it.

---

## 4. Components (binding)

**Corner radius:** pick ONE radius identity per project:
- Editorial / Modern → `rounded-2xl` for cards, `rounded-xl` for buttons
- Brutalist → `rounded-none` everywhere
- Soft / Playful → `rounded-3xl` for cards, `rounded-full` for buttons

Never mix `rounded-md` cards with `rounded-2xl` buttons — that's tell #1.

**Shadow scale** (declare 3 levels max, use consistently):

| Level | Class | Use |
|---|---|---|
| Flat | `shadow-none ring-1 ring-stone-200` | default cards |
| Lift | `shadow-lg hover:shadow-xl transition-shadow` | interactive cards |
| Modal | `shadow-2xl` | dialogs, popovers |

**Borders / rings:** prefer `ring-1 ring-stone-200/80` over heavy
`border-2 border-gray-300`. Hairline rings read more refined.

**Buttons:**

```html
<!-- Primary -->
<button class="px-5 py-2.5 rounded-xl bg-stone-900 text-stone-50
               hover:bg-stone-800 focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-stone-900
               focus-visible:ring-offset-2 transition-colors
               text-sm font-medium">
  Continue
</button>

<!-- Secondary -->
<button class="px-5 py-2.5 rounded-xl ring-1 ring-stone-300
               bg-white hover:bg-stone-50 text-stone-900 ...">
  Cancel
</button>
```

- min touch target 44×44px (use `py-2.5` minimum on mobile)
- `cursor-pointer` on every clickable
- visible focus ring on EVERY interactive element (`focus-visible:ring-2`)
- disabled = `opacity-50 cursor-not-allowed` + `aria-disabled="true"`
- loading state = spinner + disabled, never hide the button label

**Inputs:**

- visible label above input (placeholder is NOT a label)
- helper text persistent under input, not just placeholder
- error message below the field, in `text-danger` + icon
- inline validation on blur, never keystroke
- mobile input height ≥ 44px
- semantic `type=` (email/tel/number) for correct mobile keyboard

**Cards:**

```
rounded-2xl bg-white p-6 md:p-8
ring-1 ring-stone-200
hover:ring-stone-300 hover:shadow-lg
transition-all duration-200
```

**Icons:** SVG only (Lucide / Heroicons). Stroke width consistent across
the product (1.5 or 2, pick one). NEVER emoji as structural icons.

---

## 5. Motion (binding)

**Durations:** micro 150-200ms, normal 200-300ms, complex 300-400ms.
Never > 500ms.

**Easing:**
- enter / reveal: `ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)` for spring feel)
- exit / dismiss: `ease-in` (faster — exit ≈ 60-70% of enter duration)
- never `linear` on UI transitions
- never `ease-in-out` as the default (it's the LLM-default tell)

**Property rule:** animate `transform` and `opacity` ONLY. Never
`width` / `height` / `top` / `left` — they cause reflow and jank.

**Hover:** subtle. `hover:scale-[1.02]` on cards, `hover:shadow-lg`
transition, colour shift on buttons. Never bouncy or cartoonish.

**Stagger:** list/grid entrances stagger 30-50ms per item. Use
`animation-delay` or Motion's `delay`.

**Reduced motion:** wrap every animation with
`@media (prefers-reduced-motion: reduce)` → instant transitions, no
parallax. Tailwind has `motion-reduce:` variant — use it.

**No blocking animation.** User can always click through; animation
never holds input.

**Page load:** one orchestrated reveal beats scattered micro-interactions.
Stagger the hero in 3-4 phases on first paint.

### 5.1 Premier Motion — small touches that earn their wage

These are the little, unobvious animations that separate "shipped" from
"premium". Use them — they are cheap, low-risk, and add perceived quality.

- **Button press scale.** `active:scale-[0.97] transition-transform
  duration-100` on every primary button. The pressed state should *feel*
  pressed, not just look pressed.
- **Card lift on hover.** `transition-all duration-200 hover:-translate-y-0.5
  hover:shadow-xl`. Subtle vertical lift > naive shadow change.
- **Image / hero ken-burns.** On the hero image, slow `scale(1) → scale(1.04)`
  over 8-12s with `ease-out`. Brings static photography to life.
- **Number count-up.** Dashboard stat cards count from `0 → final` over
  ~600ms on first paint (use `motion`'s `animate` or a small RAF helper).
- **Skeleton shimmer.** Loading skeletons get a left-to-right gradient
  `animate-pulse` PLUS a slow shimmer overlay — feels alive, not frozen.
- **Reveal-on-scroll.** Section enters with `opacity-0 translate-y-4 →
  opacity-100 translate-y-0` once it crosses viewport. Use
  `IntersectionObserver` or Motion's `whileInView`. Stagger 50ms per child.
- **Underline grow on link hover.** `bg-gradient` underline expands from
  left or center — never the default `underline` toggle.
- **Magnetic CTA.** Buttons on landing/marketing pages tilt 2-4° toward
  the cursor. Motion library: `useMotionValue` + `useTransform`.
- **Carousel/tab indicator.** Active tab underline / dot SLIDES between
  positions (`layoutId` in Motion) instead of fading in-out.
- **Toast slide-in.** Toasts enter from the trigger origin or a screen
  edge with a spring (`stiffness ~ 300, damping ~ 24`), exit faster.
- **Modal scale-from-trigger.** Modals scale from `0.96 → 1` + fade.
  Backdrop fades to ~40-60% black at the same time.
- **Input focus halo.** `focus:ring-2 ring-accent/40` with a 200ms
  transition. Plus a 1px border colour shift. Tells the user where they are.
- **Disabled crossfade.** When a button toggles disabled, opacity slides
  `1 → 0.5` over 150ms — never an instant snap.
- **Form field error shake.** On submit error, the invalid input does a
  4-frame `translateX(-4, 4, -4, 0)` over 200ms. One per submit, not loop.
- **Checkbox / toggle spring.** Checkbox tick draws in (SVG `stroke-
  dashoffset` 0→100), toggle thumb springs across the track. Native HTML
  checkboxes are tell #2 of generic AI UI.
- **Drag affordance.** When draggable, item lifts (`scale-[1.02]
  shadow-2xl`) on `pointerdown`, drops back smoothly on release.
- **Route transitions.** Page navigation crossfades content + slides 8px
  in the navigation direction. 250ms. Never a hard cut.
- **Cursor follower (optional).** On landing / portfolio sites, a
  small accent-colour dot follows the cursor with `lerp` smoothing —
  scales up on interactive hover. Tasteful, not gimmicky.
- **Marquee / text scroll.** Long pill rows of logos / categories move
  horizontally on a slow infinite loop. Pauses on hover.
- **Chart bar grow-in.** Bar charts animate `height: 0 → final` on first
  paint with 50ms stagger. Lines draw with `stroke-dasharray`.
- **Theme toggle morph.** Sun/moon icon rotates and morphs (SVG
  `transition-transform rotate-180`) on theme switch.

**Respect reduced-motion.** Wrap every entry above in
`motion-reduce:transition-none motion-reduce:transform-none` or
equivalent. Honour the user, or be inaccessible.

---

## 6. States (binding — never skip)

Every component that fetches or computes data MUST handle four states.
A blank screen during load is a bug.

| State | What to render |
|---|---|
| **Loading** | Skeleton with same shape as final content (not a centred spinner). For ≤300ms operations, no spinner at all. |
| **Empty** | Friendly heading + one-line explanation + primary CTA to populate. Never an empty `<div>`. |
| **Error** | Heading naming the failure + retry action + secondary "help" link. Never just "Error". |
| **Success** | Inline confirmation (toast / check icon / colour flash). Auto-dismiss in 3-5s. |

Toasts: `aria-live="polite"`, never steal focus.

---

## 7. Accessibility (binding — non-negotiable)

- semantic HTML: `<button>` for buttons, `<a>` for links, `<nav>` for nav,
  `<main>` for main content. Never `<div onClick>`.
- every icon-only button has `aria-label`.
- focus ring visible on EVERY interactive element. Removing it is a bug.
- tab order matches visual order. Test with keyboard only.
- heading hierarchy sequential: h1 → h2 → h3. No skipping.
- form errors use `role="alert"` or `aria-live`.
- after submit error, focus the first invalid field.
- support `prefers-reduced-motion` and dynamic text scaling.
- colour is never the only signal — pair with icon or text.

---

## 8. Responsive (binding)

**Breakpoints** (Tailwind defaults — do not invent new ones):

| Token | Width | Target |
|---|---|---|
| (default) | 0 | mobile portrait |
| `sm:` | 640 | large phone landscape |
| `md:` | 768 | tablet |
| `lg:` | 1024 | small laptop |
| `xl:` | 1280 | desktop |
| `2xl:` | 1536 | large desktop |

**Mobile-first.** Write the mobile rule first, scale up. Never `md:hidden`
to hide critical content.

**No horizontal scroll on mobile.** Test at 375px width.

**Container gutters** widen with breakpoint: `px-4 md:px-6 lg:px-8`.

**Hero text shrinks**: `text-4xl md:text-5xl lg:text-7xl` (do not pin
display sizes at one value).

---

## 9. Final Acceptance Checklist (every worker self-checks)

Before calling `complete_job`, the worker confirms:

- [ ] no banned default in the file (see §0)
- [ ] typography pair declared, scale uses tokens
- [ ] palette uses semantic tokens, no raw hex in component
- [ ] contrast checked (body ≥ 4.5:1, icons ≥ 3:1)
- [ ] 8pt spacing rhythm, no random `gap-[7px]`
- [ ] corner-radius identity consistent with rest of project
- [ ] focus ring on every interactive
- [ ] all four states handled if fetching data (loading/empty/error/success)
- [ ] touch targets ≥ 44px on mobile
- [ ] motion uses transform/opacity only, ≤ 400ms, honours `motion-reduce`
- [ ] no emoji as structural icon
- [ ] tested mental render at 375px and at desktop

If any item fails, fix before completing.

---

*This file is loaded into every `design.md` deterministically. Edit it
here, not inside generated artefacts. Variants live next to it as
`craft_brutal.md`, `craft_editorial.md`, etc., selected via
`CRAFT_VARIANT` env var (default = `craft`).*