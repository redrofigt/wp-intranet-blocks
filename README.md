# Intranet Blocks for WordPress

Custom **React-based Gutenberg blocks** for enterprise intranets — dynamic (server-rendered) blocks with full **RTL/Arabic support** built on CSS logical properties.

## Blocks included

| Block | Type | Description |
|---|---|---|
| `intranet-blocks/news-card` | Dynamic (render.php pattern via PHP callback) | News card grid with layout (grid / featured / list), category filter, excerpt and date toggles |
| `intranet-blocks/quick-action` | Dynamic | Quick-action tile (icon + label + link) for IT desk, HR portal, room booking |

Plus the reusable pattern **“Department portal header”** (featured news card + two quick actions) for one-click portal assembly.

## Why dynamic rendering

- The editor stores **attributes only**; front-end HTML is produced by PHP render callbacks — output always follows the current template and `theme.json` design tokens
- Every attribute is re-validated server-side (whitelisted layouts/icons, integer clamping, `esc_url`/`esc_html`/`esc_attr` on all output)
- No lock-in: switching themes or updating the design system instantly restyles existing blocks

## RTL / Arabic support — the deliberate design decision

The stylesheet uses **CSS logical properties** (`margin-inline`, `padding-block`, `gap`, flexbox) — never physical `left`/`right`:

```css
.nh-news__body {
	padding-block: 0.9rem;
	padding-inline: 1.1rem;   /* flips automatically in RTL */
}
```

Result: **the same stylesheet renders correctly in LTR and RTL with zero overrides** — no `[dir="rtl"]` patch layer, no duplicated RTL build.

## Build

```
npm install
npm run build       # outputs build/ via @wordpress/scripts (webpack + React)
```

Editor components use `@wordpress/components` (InspectorControls, PanelBody, SelectControl, ToggleControl, ServerSideRender) so the settings panel is native-Gutenberg-quality.

## Demo recording script (for the screening answer)

1. Live site: show the homepage using **News Card** (featured layout) + **Quick Action** tiles
2. Same URL with `/ar/` (Polylang Arabic locale) → show the mirrored RTL layout with no visual regressions
3. Editor: insert News Card → 2-minute walkthrough of the settings panel (layout switch grid→featured→list, category picker, excerpt/date toggles) — ServerSideRender updates live
4. Show the repo: `src/` (React) and `includes/class-render.php` (validated server rendering)

## File map

```
wp-intranet-blocks.php            Bootstrap: assets, block + pattern registration
includes/class-render.php         Server-side render callbacks (escaped, whitelisted)
src/blocks/news-card/             News Card: block.json + React edit component
src/blocks/quick-action/          Quick Action: block.json + React edit component
src/style.css                     Logical-property stylesheet (LTR+RTL in one file)
package.json                      @wordpress/scripts build tooling
```
