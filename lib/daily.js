// How many posts you get per day, and how the daily batch is chosen.
export const DAILY_COUNT = 12; // posts in today's feed
export const LOAD_COUNT = 6; // posts added each time you scroll near the end (infinite scroll)
export const LOAD_AHEAD = 3; // start loading when this many posts are left below you

// Local date as YYYY-MM-DD (so "today" changes at your midnight, not UTC's).
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Picks the next `count` post ids you haven't seen yet and skips anything marked "Got it".
// When you've seen everything, it starts a new round.
export function pickIds(allIds, doneIds, seenIds, count) {
  const done = new Set(doneIds);
  const seen = new Set(seenIds);

  const picked = allIds.filter((id) => !done.has(id) && !seen.has(id)).slice(0, count);
  let nextSeen = [...seen, ...picked];

  if (picked.length < count) {
    const taken = new Set(picked);
    let fresh = allIds.filter((id) => !done.has(id) && !taken.has(id));
    if (fresh.length + picked.length < count) {
      fresh = allIds.filter((id) => !taken.has(id));
    }
    picked.push(...fresh.slice(0, count - picked.length));
    nextSeen = [...picked];
  }

  return { ids: picked, seen: nextSeen };
}

// Picks `count` more posts for infinite scroll. Never repeats a post already in today's feed.
// Returns null when every post is already in today's feed.
export function pickMore(allIds, doneIds, seenIds, todayIds, count) {
  const inToday = new Set(todayIds);
  if (inToday.size >= allIds.length) return null;

  const { ids, seen } = pickIds(allIds, doneIds, seenIds, count);
  let fresh = ids.filter((id) => !inToday.has(id));

  // After a round restarts, pickIds can hand back posts already shown today. Top up from the rest.
  if (fresh.length < count) {
    const have = new Set([...inToday, ...fresh]);
    fresh = [...fresh, ...allIds.filter((id) => !have.has(id)).slice(0, count - fresh.length)];
  }
  return { ids: fresh, seen: [...new Set([...seen, ...fresh])] };
}
