# How to Add a New Resource

For non-coders. About 30 minutes the first time. If you get stuck, screenshot it and ask in Discord.

You will edit **7 files**. Mostly you copy an existing resource and rename it.

| File | What it does |
| --- | --- |
| 1. URL list (`src/i18n/routing.ts`) | Tells the site the page exists. |
| 2. Page file | Loads when someone visits the URL. |
| 3. Content file | The page layout. |
| 4. `public/i18n/en.json` | English text. |
| 5. `public/i18n/de.json` | German text. |
| 6. `resources.tsx` | The card on `/resources`. |
| 7. `navigation.ts` (+ both JSON files) | Sidebar entry. |

This guide pretends you're adding a **Rust** language page. Wherever you see `Rust`, `rust`, or `RUST`, swap in your own name. Capitalization matters — keep the same shape.

> **Tip:** Use VS Code's Find and Replace (`Ctrl+H` / `Cmd+H`) with **Match Case ON**. Save after every step (`Ctrl+S` / `Cmd+S`).

---

## Step 1 — Add the URL

Open `src/i18n/routing.ts`. Find the existing language entries and add yours below them:

```ts
"/resources/languages/rust": {
  de: "/ressourcen/sprachen/rust",
},
```

If your topic has a real German word, use it on the `de:` line. Otherwise keep it the same as the English. Never leave it empty.

---

## Step 2 — Make the page shell

In `src/app/[locale]/(sidebar)/resources/languages/`:

1. Copy the `python` folder, rename the copy to `rust`.
2. Open `rust/page.tsx` and run Find and Replace **on this file only**, three times:
   - `Python` → `Rust`
   - `python` → `rust`
   - `PYTHON` → `RUST`

---

## Step 3 — Make the content file

In `src/components/pages/resources/languages/`:

1. Copy `python.tsx`, rename the copy to `rust.tsx`.
2. Run the same three find-and-replaces inside `rust.tsx`.

If you want different external links, change the `href="https://..."` lines. Otherwise leave the layout alone — the actual words come from the next step.

---

## Step 4 — Add the English text

Open `public/i18n/en.json`.

**Find the `"PYTHON":` block** (the one with a `META` block inside, near the resources area). Copy the whole block, paste it right below itself, and:

- Change the new block's first line from `"PYTHON":` to `"RUST":`.
- Replace every value (text inside quotes on the right) with your real Rust content. Don't change the keys (the words in caps on the left).

**Then find `"ITEMS":`** higher up. Add an entry for your resource:

```json
"RUST": {
  "NAME": "Rust",
  "DESCRIPTION": "Memory-safe systems programming"
},
```

JSON rules: keep the double quotes, keep the commas (except on the last line of a block), avoid em-dashes and curly quotes.

---

## Step 5 — Add the German text

Open `public/i18n/de.json` and do exactly the same as Step 4, but in **real native German**. If you don't speak German, ask in Discord. Do not paste English into the German file.

---

## Step 6 — Add the card on /resources

Open `src/components/pages/resources/resources.tsx`.

1. Pick an icon at [react-icons.github.io](https://react-icons.github.io/react-icons/). For Rust, `SiRust` works.
2. At the top of the file, add your icon to the matching import line:
   ```ts
   import { SiJavascript, SiPython, SiRust } from "react-icons/si";
   ```
3. Find the `RESOURCES.ITEMS.PYTHON` block in the file. Add yours right after it:
   ```ts
   {
     nameKey: msg("RESOURCES.ITEMS.RUST.NAME"),
     descriptionKey: msg("RESOURCES.ITEMS.RUST.DESCRIPTION"),
     href: "/resources/languages/rust" as const,
     icon: SiRust,
   },
   ```

---

## Step 7 — Add the sidebar entry

**Part A.** Open `src/components/layout/nav/navigation.ts`. Find the `RESOURCES_PYTHON` entry and add yours below:

```ts
{
  name: "MAIN.NAVIGATION.RESOURCES_RUST",
  description: "MAIN.NAVIGATION.RESOURCES_RUST_DESCRIPTION",
  href: "/resources/languages/rust",
  icon: SiRust,
},
```

If `SiRust` isn't in this file's imports yet, add it the same way as Step 6.

**Part B.** In `public/i18n/en.json`, find `RESOURCES_PYTHON` and add right below:

```json
"RESOURCES_RUST": "Rust",
"RESOURCES_RUST_DESCRIPTION": "Rust resources and guides",
```

**Part C.** Do the same in `public/i18n/de.json` with German text.

---

## Preview your work

Open a terminal in the project folder and run:

```
bun run dev
```

When it says `Ready`, open **http://localhost:3000/en/resources** and check:

- The new card shows on `/resources`.
- Clicking it loads your page with your text.
- The German URL works too.
- The sidebar shows the new entry.

Press `Ctrl+C` in the terminal to stop the server when you're done.

---

## Troubleshooting

| What you see | Likely cause |
| --- | --- |
| Blank page or error | Missing comma or quote in `en.json` / `de.json`. The terminal will name the line. |
| Card or page missing | Typo in the slug. It must be identical across all 7 steps. |
| Raw key like `RESOURCES.RUST.TITLE` shown on the page | You skipped or misspelled the translation block. |
| Build fails with "icon is not defined" | Icon is used but not imported. Go back to Step 6. |
| German page shows English text | Step 5 was skipped. Don't ship it like that. |

---

## Adding a guide instead of a language

Same 7 steps, but use these as your template instead of `python`:

- Page file: `src/app/[locale]/(sidebar)/resources/guides/vibe-coding/page.tsx`
- Content file: `src/components/pages/resources/guides/vibe-coding.tsx`
- URL becomes `/resources/guides/your-slug`

---

When everything works, commit your changes (or ask a developer) and open a pull request. Once it's merged, your resource is live.
