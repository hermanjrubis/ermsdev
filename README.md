# ermsDev portfolio

Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4, built to the ermsDev brand spec.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes prerender as static)
npm start
npm run lint
```

Space Grotesk loads through `next/font/google`, so the first build needs internet access to reach Google Fonts.

## Edit your content

All copy lives in **`content/site.ts`**. Replace every `[BRACKETED]` placeholder there. Project links that are still placeholders show as plain text, not broken links, until you put in a real URL.

The lanyard ID card in the hero reads from `idCard` in the same file. Your photo is `public/me.jpg`; swap the file to change it.

## Layout width

The content column is set by `--content-max` at the top of `app/globals.css` (now 1520px). Change that one value to make the whole site wider or narrower.

## Hero and motion

- `TypedHeading`: "Hi, I'm Herman John Rubis" types itself in on load. Pure CSS, and screen readers get the plain sentence.
- `RoleTicker`: types and erases each role in `site.roles` with the blinking underscore as the cursor, and uneven key timing so it reads as a person typing.
- `LocalTime`: live clock in `site.timeZone`, next to your status line.
- Nav links get an accent underline that slides in. Project cards darken their border and nudge the ↗ on hover. Sections and cards rise in as you scroll (Chrome, Edge and Safari; other browsers just show them).
- Everything above turns off with `prefers-reduced-motion`.

## Home sections

- **Tools I build with** (`components/TechMarquee.tsx`): two rows of one-colour logos from Simple Icons, drifting in opposite directions, slowing on hover. Edit the list in `techStack` (content/site.ts).
- **Projects** (`components/ProjectList.tsx`): numbered index rows. On desktop, hovering a row shows that project's front page in a frame that follows the cursor (screenshots in `public/projects/`); on phones the screenshot sits inside the row. Only links that exist are shown. Edit `projects` in content/site.ts.
- **Contact** (`components/ContactBlock.tsx`): large email link with a copy button.
- **GitHub activity** (`components/GithubActivity.tsx`): last year of contributions for `site.github`, fetched from github-contributions-api.jogruber.de and cached for an hour. Greys only, darkest = busiest; click a day to jump to that day on GitHub.

`components/ui/` holds the two third-party primitives (InfiniteSlider from motion-primitives, ActivityHeatmap), following the shadcn convention so they stay separate from the site's own components. Both use the `motion` package. `lib/utils.ts` has the `cn()` helper they expect.

`next.config.ts` skips the Tailwind loader for `*.module.css`, so CSS Modules keep their scoped class names.

## Lanyard ID card

`components/lanyard/` holds a 3D ID card on a strap that you can grab and swing (three.js + @react-three/fiber + @react-three/rapier physics).

- The card, strap and text are drawn in code (`textures.ts`), so there are no image or 3D model files. The card is the opposite colour of the page: black on light, white on dark.
- The canvas covers the whole hero, so you can drag the card anywhere across it, even over the text. It reads the mouse from the hero, so links and buttons underneath still work, and letting go of the card never clicks what's under it.
- It only shows on screens 1024px and wider. On phones, dragging the card would get in the way of scrolling, so it doesn't load there at all.
- The 3D libraries load only when the card is shown, and physics pauses when the hero is scrolled out of view.
- With reduced motion turned on, the card starts out hanging still instead of dropping in. It still moves if you drag it.

## Files

```
app/
  layout.tsx          Root layout: font, theme script, skip link, Navbar, Footer
  globals.css         Tailwind + brand tokens mapped to utilities (bg-paper, text-ink, border-line…)
  page.tsx            Home (hero with blinking logo + selected work)
  projects/page.tsx   Projects
  about/page.tsx      About (bio, toolbox, experience)
  contact/page.tsx    Contact (email, socials, location)
  loading.tsx         Loading state (blinking logo)
  not-found.tsx       404
  icon.svg            Favicon (spec tile, static)
components/
  Logo.tsx            Wordmark: inline SVG "e" + "rmsDev" + underscore cursor (size, blink props)
  Navbar.tsx          72px header, static logo, 1px line border
  NavMenu.tsx         Client: links with aria-current; disclosure menu below 640px
  ThemeToggle.tsx     Client: manual light/dark override saved to localStorage
  Footer.tsx, Section.tsx, PageHeader.tsx, ProjectCard.tsx
content/site.ts       All placeholder content + types
components/HeroStage.tsx  Full-width hero: text column + lanyard anchor column
components/TypedHeading.tsx, RoleTicker.tsx, LocalTime.tsx  Hero motion
components/lanyard/   Draggable 3D lanyard ID card (Lanyard, LanyardSlot, textures)
lib/theme.ts          Shared localStorage key
lib/useResolvedTheme.ts  Current light/dark theme for client components
styles/tokens.css     Brand colours, logo CSS, blink animation, theme icon switching
```

## Brand rules enforced in code

- Palette is only the spec values in `styles/tokens.css`. The accent `#2D9CDB` appears only on the underscore, link underlines and focus rings, never as body text.
- The logo measures everything in em, so `<Logo size={n} />` scales it. At 46px the "e" box is 27.6px, the underscore 22 × 6px with a 6px gap, and both the ring bottom and the underscore sit exactly on the text baseline (checked in a browser).
- Only the hero and loading logos blink (1.1s, `steps(1, end)`, visible for the first 55%). The navbar logo and favicon are static. With `prefers-reduced-motion: reduce` the underscore stays visible and doesn't move.
- Theme follows `prefers-color-scheme`. The toggle sets `data-theme` on `<html>`, an inline script reapplies it before first paint (no flash), and the toggle icon switches through CSS, so server and client HTML match.

## Assumptions

1. **Next.js 16.4 + Tailwind v4** (what `create-next-app@latest` installs today). Tailwind v4 has no `tailwind.config.js`, so tokens are mapped in `globals.css` with `@theme inline`. The scaffold's `cacheComponents` and `partialPrefetching` stay on; every page is static.
2. **The blinking cursor is pure CSS**, so `Logo` stays a server component. The only client components are `ThemeToggle` and `NavMenu`.
3. **Mobile menu below 640px.** The logo plus three links with the required 14px padding is about 360px wide, which doesn't fit a 360px phone with 16px gutters. Under 640px the links move into a disclosure menu (Esc closes it, and it closes when you follow a link).
4. **Hover:** nav links go to ink on light and accent on dark ("hover on dark" in the spec). The primary button darkens with the nav grey.
5. **Focus rings use the accent.** At 3.05:1 on white it passes the 3:1 rule for non-text UI, but not the 4.5:1 rule for text.
6. **Text tokens added:** `--nav` (#374151 / #D1D5DB) and `--link-hover` are new tokens taken from the spec's colour table.
7. **No contact form** (it would need a backend). Contact shows email and social links.
8. **Footer year is fixed** in `content/site.ts` (`copyrightYear`), because Cache Components won't allow `new Date()` in a prerendered server component.
9. **Corners are square** on cards and buttons to match the underscore. Only the favicon tile is rounded (radius 14).
