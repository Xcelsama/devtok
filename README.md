# DevTok

A short daily feed of front-end dev posts, built to replace doomscrolling. You get 12 posts a day, then the feed ends.

- 210 posts in `data/posts.json` (no database, no API, no account)
- Your saves, "Got it" marks and today's feed live in your browser (localStorage)
- Installable on your phone as an app (PWA)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. On a computer, press `j` and `k` (or the arrow keys) to move between posts.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com choose Add New, then Project, and import the repo.
3. Leave every setting as it is and press Deploy. Vercel detects Next.js by itself.

Then open the link on your phone and use Add to Home Screen (iPhone: Share menu, Android: browser menu).

## Change how it behaves

Open `lib/daily.js`:

| Setting | Default | What it does |
|---|---|---|
| `DAILY_COUNT` | 12 | Posts in today's feed |
| `BONUS_COUNT` | 5 | Posts added each time you tap "Show more" |
| `MAX_BONUS` | 2 | How many times per day you can ask for more |

Topic colours live in `lib/tags.js`.

## Add or edit posts

1. Add a file to `content/posts/`, for example `211-my-post.json`, using the same fields as the others.
2. Run `npm run content`. It checks every file and rebuilds `data/posts.json`.

Fields: `id`, `tag`, `level`, `title`, `why_it_matters`, `explanation`, `code` (or null), `language` (or null), `try_it`, `read_time_sec`. Optional: `image` (a path like `/images/x.png` in `public/images`). A new `tag` needs an entry in `lib/tags.js`, or it gets a default colour.

## How the daily feed works

The first time you open the app each day, it picks the next 12 posts you haven't seen, skipping anything you marked "Got it". Reloading the page keeps the same 12. When you have seen all 210, a new round starts.

## Project map

```
app/            page, layout, styles, manifest
components/     Feed, PostCard, Library, Saved, Nav, App (all the state)
lib/            daily.js (batch logic), store.js (localStorage), tags.js
data/posts.json the feed's content
content/posts/  one file per post (source for data/posts.json)
```
