# DevTok

A feed of short front-end dev posts. It starts each day with 12 posts and keeps loading more as you scroll, and a daily streak rewards you for showing up.

- 334 posts in `data/posts.json` (no database, no API, no account)
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
| `LOAD_COUNT` | 6 | Posts added each time infinite scroll loads more |
| `LOAD_AHEAD` | 3 | Loads more when this many posts are left below you |

Open `lib/streak.js` to change `STREAK_GOAL` (default 5): the number of posts you scroll to for a day to count.

## Daily streak

A day counts once you scroll to the 5th post. Counting days in a row builds your streak. Miss a full day and it resets to 0 (your best streak is kept). Tap the flame in the top corner of the feed to see your streak, your best, and the last 7 days. It is stored in your browser like everything else, and "Reset all progress" clears it.

Topic colours live in `lib/tags.js`.

## Add or edit posts

1. Add a file to `content/posts/`, for example `211-my-post.json`, using the same fields as the others.
2. Run `npm run content`. It checks every file and rebuilds `data/posts.json`.

Fields: `id`, `tag`, `level`, `title`, `why_it_matters`, `explanation`, `code` (or null), `language` (or null), `try_it`, `read_time_sec`. Optional: `image` (a path like `/images/x.png` in `public/images`). A new `tag` needs an entry in `lib/tags.js`, or it gets a default colour.

## How the daily feed works

The first time you open the app each day, it picks the next 12 posts you haven't seen, skipping anything you marked "Got it". Reloading the page keeps the same 12. As you scroll near the bottom, 6 more posts load automatically (infinite scroll). When you have seen all 334, the feed ends for the day and a new round starts tomorrow.

## Project map

```
app/            page, layout, styles, manifest
components/     Feed, PostCard, StreakBadge, Library, Saved, Nav, App (all the state)
lib/            daily.js (batch + infinite scroll logic), streak.js (daily streak), store.js (localStorage), tags.js
data/posts.json the feed's content
content/posts/  one file per post (source for data/posts.json)
```
