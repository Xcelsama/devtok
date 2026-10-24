// Everything is saved in your browser (localStorage). No database, no account.
const KEY = "devtok:v1";

export const EMPTY_STATE = {
  saved: [], // ids you bookmarked
  done: [], // ids you marked "Got it"
  seen: [], // ids already shown in a daily batch (current round)
  today: { date: "", ids: [], viewed: 0 }, // viewed = how many of today's posts you scrolled to
  streak: { current: 0, best: 0, lastDay: "", days: [] }, // days = recent days you hit the daily goal
};

export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_STATE;
    return { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or blocked (private mode). The app still works for this session.
  }
}
