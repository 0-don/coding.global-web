# How to Add a New Resource

This guide walks you through adding a new resource page (like a language guide, tutorial, or AI assistant page) to the website. It is written for non-technical contributors. You do not need to know how to code, but you do need to be able to copy files, paste text, and follow steps carefully.

If you get stuck at any step, ask in our Discord server and someone will help you finish.

## Before you start

You need:

1. The project open on your computer in any text editor (VS Code is recommended and free).
2. A clear idea of:
   - The **name** of the resource (e.g. "Rust", "Docker Basics").
   - The **category** it belongs to (Language, Guide, or AI Assistant).
   - The **URL slug** you want (e.g. `rust`, `docker-basics`). Use lowercase letters and dashes only. No spaces.
   - The **content** you want on the page (a few paragraphs of text and any links).

In this guide we will pretend you are adding a Rust language page. Wherever you see `rust`, `Rust`, or `RUST`, replace it with your own resource name.

## The 7 steps

You will touch 7 places. Do them in order. Do not skip any.

1. Add the URL to the routing config
2. Create the page file
3. Create the content component
4. Add the English translations
5. Add the German translations
6. Add a card on the main Resources page
7. Add the entry to the sidebar navigation

After step 7, run a quick check (described at the end) to confirm everything works.

---

### Step 1: Add the URL to the routing config

**File to open:** `src/i18n/routing.ts`

Find the block that lists resource URLs. It looks like this:

```ts
"/resources/languages/javascript": {
  de: "/ressourcen/sprachen/javascript",
},
"/resources/languages/python": {
  de: "/ressourcen/sprachen/python",
},
```

Add a new entry below the last language. For Rust:

```ts
"/resources/languages/rust": {
  de: "/ressourcen/sprachen/rust",
},
```

The left side is the English URL. The `de:` line is the German URL. If your resource name is the same in German, keep it the same. If it has a German translation, use that.

Save the file.

---

### Step 2: Create the page file

**Folder to open:** `src/app/[locale]/(sidebar)/resources/languages/`

Inside this folder you will see one folder per language (`javascript`, `python`). Create a new folder with your slug. For Rust, create a folder named `rust`.

Inside that new `rust` folder, create a file called `page.tsx`.

Open the existing `python/page.tsx` file, copy everything inside it, and paste it into your new `rust/page.tsx`.

Now find and replace these things in your new file (and ONLY in your new file):

- Replace every `Python` with `Rust`
- Replace every `python` with `rust`
- Replace every `PYTHON` with `RUST`

Save the file.

---

### Step 3: Create the content component

**Folder to open:** `src/components/pages/resources/languages/`

Inside this folder you will see `python.tsx` and `javascript.tsx`. Make a copy of `python.tsx` in the same folder and rename the copy to `rust.tsx`.

Open `rust.tsx` and find/replace as in step 2:

- Replace every `Python` with `Rust`
- Replace every `python` with `rust`
- Replace every `PYTHON` with `RUST`

You can leave the structure of the file alone. The actual text on the page comes from the translation files in the next steps.

If you want the page to link to outside websites (like a tutorial), update the `href="..."` URLs inside the file to point to those websites.

Save the file.

---

### Step 4: Add the English translations

**File to open:** `public/i18n/en.json`

This is the file that holds every line of text shown to English-speaking visitors.

Find the existing `"PYTHON"` block. It looks like this:

```json
"PYTHON": {
  "META": {
    "TITLE": "Python - Coding Global",
    "DESCRIPTION": "Master Python with guides, tutorials, and best practices for all skill levels",
    "KEYWORDS": "python, programming, tutorials, data science, automation"
  },
  "TITLE": "Python",
  "CONTENT_1": "Python is really only relevant for...",
  "CONTENT_2": "Many people choose Python...",
  "CONTENT_3": "But if you really want to learn Python, check out",
  "FREECODECAMP_LINK": "FreeCodeCamp's Scientific Computing with Python",
  "OR": "or",
  "CODECADEMY_LINK": "Codecademy's Python courses"
},
```

Copy that entire block, paste it directly below the original, and:

1. Change the key on the first line from `"PYTHON"` to `"RUST"`.
2. Replace every text value with your real Rust content. Write the actual paragraphs you want visitors to read. Do not leave any text saying "Python" or anything else from the original.

Important rules:

- Keep the quotes `"..."` around every value.
- Keep the commas at the end of each line (except the last line of the block).
- Do NOT use special punctuation like em dashes (long dashes), curly quotes, or arrows. Stick to normal keyboard characters: `-`, `'`, `"`.

Also, find the `"ITEMS"` block higher up in the same file. It contains entries like:

```json
"PYTHON": {
  "NAME": "Python",
  "DESCRIPTION": "Data science & automation"
},
```

Add a new entry for Rust:

```json
"RUST": {
  "NAME": "Rust",
  "DESCRIPTION": "Systems programming with safety"
},
```

Save the file.

---

### Step 5: Add the German translations

**File to open:** `public/i18n/de.json`

Repeat exactly what you did in step 4, but in German. Every English entry you added needs a German equivalent in this file. Use real native German, not a copy of the English text.

Important rule for German: use full-width punctuation only when writing Chinese (which doesn't apply here). For German, use regular keyboard punctuation. But avoid em dashes and curly quotes.

If you do not speak German, ask in Discord for someone to help translate. Do not leave English placeholders in the German file.

Save the file.

---

### Step 6: Add a card on the main Resources page

**File to open:** `src/components/pages/resources/resources.tsx`

Find the section that lists language items. It looks like this:

```ts
items: [
  {
    nameKey: msg("RESOURCES.ITEMS.JAVASCRIPT.NAME"),
    descriptionKey: msg("RESOURCES.ITEMS.JAVASCRIPT.DESCRIPTION"),
    href: "/resources/languages/javascript" as const,
    icon: SiJavascript,
  },
  {
    nameKey: msg("RESOURCES.ITEMS.PYTHON.NAME"),
    descriptionKey: msg("RESOURCES.ITEMS.PYTHON.DESCRIPTION"),
    href: "/resources/languages/python" as const,
    icon: SiPython,
  },
],
```

Add a new entry below Python:

```ts
{
  nameKey: msg("RESOURCES.ITEMS.RUST.NAME"),
  descriptionKey: msg("RESOURCES.ITEMS.RUST.DESCRIPTION"),
  href: "/resources/languages/rust" as const,
  icon: SiRust,
},
```

You also need to import the icon. Near the top of the file you will see a line like:

```ts
import { SiJavascript, SiPython } from "react-icons/si";
```

Add `SiRust` to that line:

```ts
import { SiJavascript, SiPython, SiRust } from "react-icons/si";
```

To find the right icon name for your resource, browse [react-icons.github.io](https://react-icons.github.io/react-icons/) and search for your topic. Pick an icon and use its name.

Save the file.

---

### Step 7: Add the entry to the sidebar navigation

**File to open:** `src/components/layout/nav/navigation.ts`

Find the block that lists language pages. It looks like:

```ts
{
  name: "MAIN.NAVIGATION.RESOURCES_PYTHON",
  description: "MAIN.NAVIGATION.RESOURCES_PYTHON_DESCRIPTION",
  href: "/resources/languages/python",
  icon: SiPython,
},
```

Add a new entry below Python:

```ts
{
  name: "MAIN.NAVIGATION.RESOURCES_RUST",
  description: "MAIN.NAVIGATION.RESOURCES_RUST_DESCRIPTION",
  href: "/resources/languages/rust",
  icon: SiRust,
},
```

Make sure `SiRust` is imported at the top of this file too. If it isn't, add it the same way you did in step 6.

Now go back to `public/i18n/en.json` and `public/i18n/de.json` and add these two new keys near the other `MAIN.NAVIGATION.RESOURCES_...` entries:

```json
"RESOURCES_RUST": "Rust",
"RESOURCES_RUST_DESCRIPTION": "Rust resources and guides",
```

Use the German equivalents in `de.json`.

Save all the files.

---

## Final check

Open a terminal in the project folder and run:

```
bun run dev
```

Wait for it to say "Ready". Then open your browser to `http://localhost:3000/en/resources` and check that:

1. Your new card appears on the main Resources page.
2. Clicking the card takes you to `/en/resources/languages/rust` and you see your title, content, and any links you added.
3. The same works in German at `/de/ressourcen/sprachen/rust`.
4. Your new entry shows up in the sidebar.

If anything looks wrong (missing text, an error page, etc.), the most common causes are:

- A missing comma or quote in one of the JSON files.
- A typo in the URL slug (it must match exactly across all 7 steps).
- The icon import was forgotten.

Fix the issue, save, and refresh the browser.

---

## Variations

- **Adding a guide instead of a language?** Use the folder `src/app/[locale]/(sidebar)/resources/guides/` and `src/components/pages/resources/guides/` instead. Use `vibe-coding` or `cyber-security` as your template instead of `python`. The URL becomes `/resources/guides/your-slug`.
- **Adding an AI assistant?** Use `src/app/[locale]/(sidebar)/resources/ai-assistants/` as the template. There is currently only one such page.

The 7 steps are otherwise identical. The folders, file names, and translation key prefixes change, but the pattern is the same.

---

## When you are done

Commit your changes (or ask a developer to do it for you), open a pull request, and the team will review it. Once it's merged, your resource will be live on the site.
