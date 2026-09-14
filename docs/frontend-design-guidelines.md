# Mood Diary — Frontend UI & Design Guidelines

## 1. Design Direction

Mood Diary should have a warm, personal, and calming visual identity inspired by:

- Scrapbooks
- Handwritten journals
- Polaroid photos
- Paper notes
- Stickers and washi tape
- Soft pastel stationery

The UI should feel cute and personal, but NOT childish.

Avoid:

- Typical SaaS/admin-dashboard appearance
- Strong gradients
- Neon colors
- Excessive glassmorphism
- Heavy shadows
- Extremely rounded "toy-like" components
- Too many decorative elements competing for attention

The final visual direction should be:

> Warm Journal / Scrapbook / Pastel / Hand-drawn

---

## 2. Frontend Stack

Use the project's existing stack where available.

Preferred UI stack:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui for base components
- Lucide Icons
- `next/font/google` for fonts

shadcn/ui should provide the component foundation.

Do NOT keep the default shadcn visual appearance unchanged.
Customize it using the Mood Diary design tokens defined below.

Do not introduce another component library unless there is a clear need.

---

## 3. Design Token Principles

All reusable colors MUST be defined globally.

Do NOT hardcode colors repeatedly inside components.

Bad:

```tsx
<button className="bg-[#EFA6B5] text-[#38302E]">
```

Good:

```tsx
<button className="bg-primary text-foreground">
```

Prefer semantic names such as:

- `primary`
- `background`
- `surface`
- `foreground`
- `muted-foreground`
- `border`
- `destructive`

instead of:

- `pink`
- `brown`
- `purple`

Color names should describe their PURPOSE, not only their visual color.

---

## 4. Core Color Palette

### Base

| Token | Color | Usage |
|---|---|---|
| `background` | `#FFF9F0` | Main paper-like application background |
| `surface` | `#FFFCF7` | Cards, dialogs, inputs, panels |
| `foreground` | `#38302E` | Primary text |
| `muted-foreground` | `#766B67` | Secondary text, captions, placeholders |
| `border` | `#B9A9A1` | Borders, separators, paper outlines |

### Brand

| Token | Color | Usage |
|---|---|---|
| `primary` | `#EFA6B5` | Main CTA, active states, brand highlights |
| `primary-hover` | `#D9788E` | Primary hover/pressed states |
| `secondary` | `#C9B8E4` | Secondary actions and lavender decoration |

### Accent

| Token | Color | Usage |
|---|---|---|
| `accent-green` | `#A9BFA3` | Tags, botanical/sticker decorations |
| `accent-blue` | `#B8D4E3` | Secondary cards and decorative elements |

### Semantic States

| Token | Color | Usage |
|---|---|---|
| `error` / `destructive` | `#C85C6C` | Validation and destructive actions |
| `success` | `#7E9F78` | Successful actions and positive states |

---

## 5. Mood Colors

Mood colors are domain-specific tokens and should remain separate from generic UI colors.

```css
--mood-very-sad: #afc8dc;
--mood-sad: #b8c7a8;
--mood-neutral: #e7d8b5;
--mood-happy: #f2c5cf;
--mood-very-happy: #d2bde8;
```

Mapping:

| Mood | Color |
|---|---|
| `VERY_SAD` | Powder Blue `#AFC8DC` |
| `SAD` | Soft Sage `#B8C7A8` |
| `NEUTRAL` | Warm Beige `#E7D8B5` |
| `HAPPY` | Soft Pink `#F2C5CF` |
| `VERY_HAPPY` | Lavender `#D2BDE8` |

These colors may be used for:

- Mood selector
- Calendar indicators
- Mood history
- Charts
- Polaroid cards
- Mood badges

Do not rely on color alone to communicate mood.
Always combine it with a label, icon, emoji, or another visual indicator.

---

## 6. Global CSS Tokens

Use the following as the initial theme foundation:

```css
:root {
  /* Base */
  --background: #fff9f0;
  --surface: #fffcf7;

  /* Brand */
  --primary: #efa6b5;
  --primary-hover: #d9788e;
  --secondary: #c9b8e4;

  /* Accent */
  --accent-green: #a9bfa3;
  --accent-blue: #b8d4e3;

  /* Typography */
  --foreground: #38302e;
  --muted-foreground: #766b67;

  /* UI */
  --border: #b9a9a1;
  --destructive: #c85c6c;
  --success: #7e9f78;

  /* Mood */
  --mood-very-sad: #afc8dc;
  --mood-sad: #b8c7a8;
  --mood-neutral: #e7d8b5;
  --mood-happy: #f2c5cf;
  --mood-very-happy: #d2bde8;
}
```

If shadcn/ui is already configured, map these values into the existing shadcn semantic token system rather than creating a duplicate theme system.

---

## 7. Typography

Use two font families only.

### Decorative / Heading Font — Patrick Hand

Use for:

- App logo
- Major page titles
- Journal headings
- Dates where appropriate
- Small decorative labels

Examples:

- Mood Diary ♡
- How are you feeling today?
- September
- My little journal

### UI / Body Font — Nunito

Use for:

- Buttons
- Inputs
- Forms
- Navigation
- Body text
- Error messages
- Tables
- Dialogs
- Normal UI labels

### Rule

Do NOT use the handwritten font for long paragraphs, forms, or important functional UI.

The handwritten font is decorative, not the primary application font.

Recommended hierarchy:

| Element | Font |
|---|---|
| Logo | Patrick Hand |
| Page title | Patrick Hand |
| Decorative heading | Patrick Hand |
| Body | Nunito |
| Button | Nunito |
| Input | Nunito |
| Navigation | Nunito |
| Validation | Nunito |

Load fonts through `next/font/google` when possible.

---

## 8. Component Style

### Cards

Cards should resemble:

- Journal paper
- Polaroid photos
- Scrapbook notes

Prefer:

- Warm white background
- Thin warm border
- Subtle shadow
- Moderate rounded corners
- Slight visual imperfections where appropriate

Some decorative cards may use a very small rotation: `-1deg`, `0deg`, `+1deg`.

Do NOT randomly rotate functional UI such as forms, dialogs, or navigation.

---

## 9. Polaroid Component

Mood history can use reusable Polaroid-style cards.

Concept:

```
╭─────────────╮
│             │
│    🌷 ☁️    │
│             │
├─────────────┤
│ HAPPY ♡     │
│ Sep 14      │
╰─────────────╯
```

A Polaroid may contain:

- Mood illustration
- Mood label
- Date
- Short note preview

Keep the component reusable.

Do not duplicate Polaroid styling across pages.

---

## 10. Buttons

**Primary buttons:**

- Dusty pink background
- Dark readable text
- Soft hover transition
- Clear focus state

**Secondary buttons:**

- Paper/surface background
- Warm border
- Dark text

**Destructive buttons:**

- Use destructive semantic color
- Do not style destructive actions as cute decorative buttons

Buttons should remain obviously interactive.

Cute design must never reduce usability.

---

## 11. Inputs & Forms

Inputs should feel like writing in a journal while remaining standard and accessible.

Use:

- Paper-white background
- Warm border
- Soft focus ring
- Nunito for entered text
- Clear validation states

Textarea is especially important for mood notes.

Avoid overly decorative form controls.

Login and registration forms should remain clean and easy to scan.

---

## 12. Decorative Elements

Allowed decorative elements:

- ♡ hearts
- ✦ small stars
- Flowers
- Leaves
- Bows
- Clouds
- Moon
- Tape
- Stickers
- Small hand-drawn arrows

Use them sparingly.

Decoration should support the scrapbook identity, not become the main content.

Prefer CSS/SVG assets over large raster images when practical.

---

## 13. Icons

Use Lucide Icons for functional icons.

Examples: Settings, Logout, Calendar, Previous/next, Edit, Delete, User, Navigation.

Hand-drawn decorative assets may be used separately.

Do not replace important functional icons with ambiguous decorative drawings.

---

## 14. Layout Direction

The application should feel like a digital journal rather than an admin dashboard.

Example dashboard:

```
┌─────────────────────────────────────────┐
│             Mood Diary ♡                │
│          Sunday, September 14           │
│                                         │
│      How are you feeling today?         │
│                                         │
│    😭     😔     😐     😊     🥰      │
│                                         │
│    ┌────── A little note ♡ ────────┐   │
│    │                               │   │
│    │ Tell me about your day...     │   │
│    │                               │   │
│    └───────────────────────────────┘   │
│                                         │
│             Save my day ♡               │
│                                         │
│    Recent memories                      │
│                                         │
│    [Polaroid] [Polaroid] [Polaroid]    │
└─────────────────────────────────────────┘
```

---

## 15. Responsive Design

The UI MUST support: Mobile, Tablet, Desktop.

Mood entry should be comfortable to use on mobile.

Do not design desktop first and simply shrink everything.

Polaroid history should adapt naturally:

- Desktop: 3–4 cards / row
- Tablet: 2–3 cards / row
- Mobile: 1–2 cards / row

Exact breakpoints should follow the project's Tailwind configuration.

---

## 16. Accessibility

Cute styling must not compromise accessibility.

Requirements:

- Sufficient text/background contrast
- Visible keyboard focus
- Semantic HTML
- Labels for form controls
- Keyboard-accessible interactions
- Appropriate `aria-*` attributes where necessary
- Do not communicate state using color alone
- Buttons must use `<button>`
- Navigation must use appropriate semantic elements

Decorative SVG/images should not create unnecessary screen-reader noise.

---

## 17. Component Reusability

Before creating page-specific styling, check whether the design can become a reusable component.

Potential shared components:

```
components/
├── ui/
│   └── shadcn components
│
├── mood/
│   ├── mood-selector.tsx
│   ├── mood-badge.tsx
│   ├── mood-polaroid.tsx
│   └── mood-calendar-dot.tsx
│
└── journal/
    ├── journal-card.tsx
    ├── paper-card.tsx
    ├── sticker.tsx
    └── section-heading.tsx
```

Do not create abstractions prematurely.
Extract a shared component when a visual or behavioral pattern is genuinely reused.

---

## 18. Animation

Animation should be subtle.

Allowed examples:

- Slight card lift on hover
- Heart scale when selected
- Mood selector bounce
- Soft fade/slide
- Small sticker movement

Avoid:

- Constant animations
- Large bouncing UI
- Excessive page transitions
- Animation that delays user interaction

Respect `prefers-reduced-motion`.

---

## 19. UX Principle

The target experience is:

> Opening a personal journal, not operating a management dashboard.

But functional clarity always comes before decoration.

Priority:

1. Usability
2. Accessibility
3. Consistency
4. Responsive design
5. Cute visual details

---

## 20. Implementation Rules for FE Team / AI Agents

When implementing Mood Diary UI:

- Inspect the existing project before modifying code.
- Reuse existing components where appropriate.
- Use global semantic design tokens.
- Do not hardcode palette colors repeatedly.
- Use Patrick Hand only for decorative typography.
- Use Nunito for functional UI.
- Keep shadcn components accessible.
- Customize shadcn instead of introducing unnecessary UI libraries.
- Keep components responsive.
- Avoid over-engineering the component architecture.
- Do not add dependencies without a clear reason.
- Do not implement unrelated features.
- Maintain TypeScript type safety.
- Keep styling consistent with the Warm Journal design system.
- Before making a large visual change, explain what existing components/tokens will be affected.

---

## Design Summary

| | |
|---|---|
| Theme | Warm Journal / Scrapbook / Polaroid / Pastel |
| Primary color | `#EFA6B5` — Dusty Pink |
| Background | `#FFF9F0` — Warm Cream |
| Primary text | `#38302E` — Soft Black |
| Fonts | Patrick Hand → decorative/headings · Nunito → body/UI |
| Component foundation | shadcn/ui + Tailwind CSS |
| Visual keywords | warm, handmade, cozy, personal, soft, journal, scrapbook, stationery, polaroid |

The final UI should be recognizable as Mood Diary even when decorative illustrations are removed. Consistency in typography, spacing, colors, cards, and interaction patterns should create the brand identity.
