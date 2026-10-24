import { todayKey } from "./daily";

// A day counts toward your streak once you scroll to this many posts.
export const STREAK_GOAL = 5;

const KEEP_DAYS = 90; // how many past active days to remember

// Date key for the day before `key` (YYYY-MM-DD), in local time.
export function previousDayKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d - 1));
}

// The streak to show right now. If you missed a whole day, it reads 0 (best is kept).
export function liveStreak(streak, key = todayKey()) {
  if (!streak || !streak.lastDay) return 0;
  if (streak.lastDay === key || streak.lastDay === previousDayKey(key)) return streak.current;
  return 0;
}

// Records how far you scrolled today. Returns the same object when nothing changed.
export function recordViewed(state, viewed, key = todayKey()) {
  const prevViewed = state.today.viewed || 0;
  const nextViewed = Math.max(prevViewed, viewed);
  const streak = state.streak;
  const alreadyCounted = streak.lastDay === key;
  const reachesGoal = nextViewed >= STREAK_GOAL && !alreadyCounted;

  if (nextViewed === prevViewed && !reachesGoal) return state;

  let nextStreak = streak;
  if (reachesGoal) {
    const continues = streak.lastDay === previousDayKey(key);
    const current = continues ? streak.current + 1 : 1;
    nextStreak = {
      current,
      best: Math.max(streak.best, current),
      lastDay: key,
      days: [...streak.days.filter((d) => d !== key), key].slice(-KEEP_DAYS),
    };
  }
  return { ...state, today: { ...state.today, viewed: nextViewed }, streak: nextStreak };
}

// The last 7 days (oldest first) with whether each one hit the goal.
export function lastSevenDays(streak, key = todayKey()) {
  const active = new Set(streak.days);
  const out = [];
  let day = key;
  for (let i = 0; i < 7; i++) {
    const [y, m, d] = day.split("-").map(Number);
    const label = new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "narrow" });
    out.unshift({ key: day, label, active: active.has(day), today: i === 0 });
    day = previousDayKey(day);
  }
  return out;
}
