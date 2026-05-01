# How to Add a New Resource

This guide is for people who have **never touched code before**. If you can copy text from one file to another and follow steps in order, you can do this. It takes about **30 minutes** the first time.

If you get stuck, screenshot the problem and ask in our Discord. Someone will finish it with you.

---

## What you are about to do

A "resource" is one page on the website, like the Python guide or the Vibe Coding guide. To add a new one, you have to update **7 files**. Each file does a different little job:

| File | Its job |
| --- | --- |
| 1. URL list | Tells the site that the page exists at a web address. |
| 2. Page file | The blank shell that loads when someone visits the page. |
| 3. Content file | The actual layout of the page (headings, paragraphs, links). |
| 4. English text | The English words shown on the page. |
| 5. German text | The German words shown on the page. |
| 6. Resources index | The clickable card on the main `/resources` page. |
| 7. Sidebar menu | The entry in the left-side menu. |

You will mostly be **copying an existing resource and renaming it**. You don't have to write code from scratch.

---

## Words you will see

| Word | What it means in plain English |
| --- | --- |
| **slug** | The lowercase-with-dashes name in the URL. `vibe-coding` is a slug. |
| **file** | A document on your computer. `.tsx` and `.json` are types of files. |
| **folder** | A folder on your computer that holds files. |
| **key** | The label in quotes on the left side of a `.json` line, like `"TITLE"`. |
| **value** | The text in quotes on the right side, like `"My Page"`. |
| **import** | A line at the top of a code file that loads something from somewhere else. You usually don't write these from scratch; you just add a name to an existing one. |
| **save** | Press `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac) after every edit. |

---

## Before you begin

You need:

1. **The project on your computer**, opened in **VS Code** (free, from [code.visualstudio.com](https://code.visualstudio.com/)).
2. A clear idea of:
   - **What** the resource is (e.g. a Rust guide, a Docker tutorial).
   - **What category** it goes in: **Language**, **Guide**, or **AI Assistant**.
   - **The slug**: lowercase letters and dashes only. No spaces, no capitals. Example: `rust`, `docker-basics`.
   - **The text** you want on the page (a few paragraphs and any helpful links).

**This guide pretends you are adding a "Rust" language page.** Wherever you see `Rust`, `rust`, or `RUST`, swap in your own resource name. Capitalization matters: keep the same shape (capital R becomes a capital letter of your name; lowercase r becomes lowercase, etc).

> **Tip:** VS Code has a Find and Replace feature. Press `Ctrl+H` (Windows/Linux) or `Cmd+H` (Mac) to use it. Make sure "Match Case" is turned **on** (the `Aa` button) so capital letters are kept distinct.

---

## The 7 steps at a glance

```
[ ] Step 1  Tell the site the page exists       (1 file)
[ ] Step 2  Make the page shell                 (1 new file)
[ ] Step 3  Make the page content               (1 new file)
[ ] Step 4  Add the English text                (1 file)
[ ] Step 5  Add the German text                 (1 file)
[ ] Step 6  Add the card on /resources          (1 file)
[ ] Step 7  Add the sidebar entry               (2 files)
[ ] Final   Preview in your browser
```

Print this checklist or keep it open in another window. Tick off each step as you finish it.

---

## Step 1 — Tell the site the page exists

**Open this file:** `src/i18n/routing.ts`

Scroll down until you see lines that look like this:

```ts
"/resources/languages/javascript": {
  de: "/ressourcen/sprachen/javascript",
},
"/resources/languages/python": {
  de: "/ressourcen/sprachen/python",
},
```

**Click at the end of the closing `}` after the Python block, press Enter, and add:**

```ts
"/resources/languages/rust": {
  de: "/ressourcen/sprachen/rust",
},
```

**What does this do?** It tells the site that `/resources/languages/rust` (English) and `/ressourcen/sprachen/rust` (German) are real URLs.

> If your topic has a real German translation (e.g. "Cybersicherheit"), use it on the `de:` line. If not, keep the German the same as the English. **Never leave the German line empty.**

**Save the file.** ✅ Step 1 done.

---

## Step 2 — Make the page shell

**Open this folder:** `src/app/[locale]/(sidebar)/resources/languages/`

You will see folders called `javascript` and `python`.

1. **Right-click the `python` folder** and choose **Copy**.
2. **Right-click in the same area** and choose **Paste**. You'll get a new folder, probably called `python copy` or `python_1`.
3. **Right-click the new folder** and choose **Rename**. Rename it to `rust`.

Now open `rust/page.tsx` (the file inside your new folder).

You need to change every mention of Python to Rust. Use **Find and Replace** (`Ctrl+H` / `Cmd+H`) **inside this single file**, with **Match Case ON**:

| Find | Replace with |
| --- | --- |
| `Python` | `Rust` |
| `python` | `rust` |
| `PYTHON` | `RUST` |

Do the three replacements one after the other. Click "Replace All" each time.

> **Why three?** Capital letters mean different things in code. Doing them one at a time keeps the right capital letters in the right places.

**Save the file.** ✅ Step 2 done.

---

## Step 3 — Make the page content

**Open this folder:** `src/components/pages/resources/languages/`

You will see `javascript.tsx` and `python.tsx`.

1. **Right-click `python.tsx`** and choose **Copy**.
2. **Right-click in the same area** and choose **Paste**. You'll get `python copy.tsx`.
3. **Right-click the copy** and choose **Rename**. Rename it to `rust.tsx`.

Open `rust.tsx` and run the same three find-and-replaces as in Step 2 (with **Match Case ON**):

| Find | Replace with |
| --- | --- |
| `Python` | `Rust` |
| `python` | `rust` |
| `PYTHON` | `RUST` |

> **You don't need to touch the layout code yet.** The actual words shown on the page come from the next two steps. For now, just make sure all the Python names are gone.

If you want to change a link to point somewhere else (a tutorial, an official docs page), find lines that look like `href="https://..."` and replace the URL with your own. Don't worry about it if you don't want to.

**Save the file.** ✅ Step 3 done.

---

## Step 4 — Add the English text

**Open this file:** `public/i18n/en.json`

This is the file with all the English words shown on the website.

### Part A — the page content

Press `Ctrl+F` (or `Cmd+F`) to **search inside the file**, and search for `"PYTHON":`. Look for the one that has a `META` block under it (it will be near a "RESOURCES" parent). It looks like this:

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

1. **Select that whole block** (from `"PYTHON":` down to the closing `},`).
2. **Copy it** (`Ctrl+C` / `Cmd+C`).
3. **Click at the end of the original block's `},`**, press Enter, and **paste**.

You now have two `"PYTHON":` blocks. **Change the new one's first line** to `"RUST": {`.

Now **replace every English value** with your real Rust content. The keys (left side, all caps) stay the same. Only change the words **between the quotes on the right side**.

For example:

```json
"RUST": {
  "META": {
    "TITLE": "Rust - Coding Global",
    "DESCRIPTION": "Learn Rust, the memory-safe systems language",
    "KEYWORDS": "rust, programming, systems, memory safety"
  },
  "TITLE": "Rust",
  "CONTENT_1": "Rust is a systems programming language that gives you...",
  "CONTENT_2": "...",
  ...
},
```

> **The 4 JSON rules — don't break these:**
>
> 1. Every value has **double quotes** around it: `"like this"`.
> 2. Every line inside a block ends with a **comma**, EXCEPT the last line before a closing `}`.
> 3. Don't use fancy punctuation: avoid em-dashes (—), curly quotes (' "), or arrows (→). Stick to plain keyboard letters.
> 4. Don't delete any of the keys (the words in caps on the left). Just replace the values on the right.

### Part B — the card label

Press `Ctrl+F` again and search for `"ITEMS":`. Find the part that has entries like:

```json
"PYTHON": {
  "NAME": "Python",
  "DESCRIPTION": "Data science & automation"
},
```

Add your entry right below it:

```json
"RUST": {
  "NAME": "Rust",
  "DESCRIPTION": "Memory-safe systems programming"
},
```

**Save the file.** ✅ Step 4 done.

---

## Step 5 — Add the German text

**Open this file:** `public/i18n/de.json`

Do **exactly the same thing as Step 4**, but write the values in **real native German** (not English copy-paste, not machine translation).

If you don't speak German: **stop here and ask in Discord** for a translator. Do not paste English words into the German file. The site will show them to German visitors.

> **One quick rule for German:** use normal keyboard punctuation. No em-dashes (—), no curly quotes. Just like in English.

**Save the file.** ✅ Step 5 done.

---

## Step 6 — Add the card on the main /resources page

**Open this file:** `src/components/pages/resources/resources.tsx`

### Part A — pick an icon

Open [react-icons.github.io](https://react-icons.github.io/react-icons/) in your browser. In the search box, type your topic (e.g. "rust"). Click the icon you like. The name will appear, like `SiRust`. Write it down.

### Part B — add the icon to the imports

At the top of the file, find a line like:

```ts
import { SiJavascript, SiPython } from "react-icons/si";
```

Add your icon's name to the list, separated by commas:

```ts
import { SiJavascript, SiPython, SiRust } from "react-icons/si";
```

> The two letters at the start of the icon name (`Si` here) tell you which import line to add it to. `Si` icons go in the `react-icons/si` import. `Hi` icons would go in a `react-icons/hi2` import. If your icon starts with different letters, look near the top of the file for the matching import or copy the format `from "react-icons/<two-letters-lowercase>"`.

### Part C — add the card

Search the file for `RESOURCES.ITEMS.PYTHON`. You'll find a block like:

```ts
{
  nameKey: msg("RESOURCES.ITEMS.PYTHON.NAME"),
  descriptionKey: msg("RESOURCES.ITEMS.PYTHON.DESCRIPTION"),
  href: "/resources/languages/python" as const,
  icon: SiPython,
},
```

Below the closing `},`, add:

```ts
{
  nameKey: msg("RESOURCES.ITEMS.RUST.NAME"),
  descriptionKey: msg("RESOURCES.ITEMS.RUST.DESCRIPTION"),
  href: "/resources/languages/rust" as const,
  icon: SiRust,
},
```

**Save the file.** ✅ Step 6 done.

---

## Step 7 — Add the sidebar entry

This step touches **two files**: the sidebar code and both translation files.

### Part A — the sidebar code

**Open this file:** `src/components/layout/nav/navigation.ts`

Search for `RESOURCES_PYTHON`. You'll find:

```ts
{
  name: "MAIN.NAVIGATION.RESOURCES_PYTHON",
  description: "MAIN.NAVIGATION.RESOURCES_PYTHON_DESCRIPTION",
  href: "/resources/languages/python",
  icon: SiPython,
},
```

Below it, add:

```ts
{
  name: "MAIN.NAVIGATION.RESOURCES_RUST",
  description: "MAIN.NAVIGATION.RESOURCES_RUST_DESCRIPTION",
  href: "/resources/languages/rust",
  icon: SiRust,
},
```

Then check the top of the file: is `SiRust` already in the imports? If not, add it the same way you did in Step 6 Part B.

**Save the file.**

### Part B — the sidebar labels in English

Open `public/i18n/en.json` again. Search for `RESOURCES_PYTHON`. You'll find two lines like:

```json
"RESOURCES_PYTHON": "Python",
"RESOURCES_PYTHON_DESCRIPTION": "Python resources and guides",
```

Add right below them:

```json
"RESOURCES_RUST": "Rust",
"RESOURCES_RUST_DESCRIPTION": "Rust resources and guides",
```

**Save the file.**

### Part C — the sidebar labels in German

Open `public/i18n/de.json` and do the same thing, but with German text.

**Save the file.** ✅ Step 7 done. **All seven steps are complete.**

---

## Final check — preview your work

Open a terminal **inside the project folder**:

- VS Code: menu `Terminal` then `New Terminal`.

Type this and press Enter:

```
bun run dev
```

Wait until you see `Ready` (about 10–20 seconds). Don't close the terminal.

Open your browser and go to:

> **http://localhost:3000/en/resources**

You should see:

1. ✅ Your new card on the main Resources page.
2. ✅ Clicking it takes you to a working page with your text and any links.
3. ✅ The same in German at **http://localhost:3000/de/ressourcen** (or whatever your German URL is).
4. ✅ Your new entry in the left sidebar.

When you're done, go back to the terminal and press `Ctrl+C` to stop the dev server.

---

## Something is broken — what now?

Almost every problem on this guide comes from one of these:

| What you see | The likely cause |
| --- | --- |
| Page is blank or shows an error | A missing comma or quote in `en.json` or `de.json`. The terminal will usually tell you which line. |
| The card or page is missing | A typo in the slug. The slug must be **exactly the same** in all 7 steps. |
| You see a key like `RESOURCES.RUST.TITLE` instead of real text | You forgot to add the translation block in Step 4 or 5, OR you misspelled the key. |
| Build fails with "icon is not defined" | You used an icon name that isn't in the imports. Go back to Step 6 Part B. |
| German page shows English text | You forgot to fill in `de.json` in Step 5. Don't ship it like that. |

**Fix the issue, save the file, and the browser will reload automatically.**

If you can't fix it: take a screenshot of the terminal AND the browser, post both in Discord, and tell us which step you were on.

---

## I'm not adding a language — I'm adding a Guide or an AI tool page

The pattern is the same, only the folders change.

- **Adding a guide?** Use these folders/files as your template instead of `python`:
  - `src/app/[locale]/(sidebar)/resources/guides/vibe-coding/page.tsx`
  - `src/components/pages/resources/guides/vibe-coding.tsx`
  - URLs become `/resources/guides/your-slug`
- **Adding an AI tool page?** There's currently only one (`ai-assistants`), so use it as your template:
  - `src/app/[locale]/(sidebar)/resources/ai-assistants/page.tsx`
  - `src/components/pages/resources/ai-assistants.tsx`
  - URL becomes `/resources/ai-tools/your-slug` (you'll need to create the parent folder).

Other than the folder names, all 7 steps are the same.

---

## You're done

Congrats! 🎉

Now commit your changes (or ask a developer to do it for you), open a pull request on GitHub, and the team will review it. Once it's merged, your resource will be live on the site.

Welcome to the contributors list.
