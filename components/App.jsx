"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import posts from "@/data/posts.json";
import Feed from "./Feed";
import Library from "./Library";
import Saved from "./Saved";
import Nav from "./Nav";
import PostCard from "./PostCard";
import { BackIcon } from "./icons";
import { tagStyle } from "@/lib/tags";
import { loadState, saveState, EMPTY_STATE } from "@/lib/store";
import { DAILY_COUNT, LOAD_COUNT, pickIds, pickMore, todayKey } from "@/lib/daily";
import { liveStreak, recordViewed } from "@/lib/streak";

const ALL_IDS = posts.map((p) => p.id);
const BY_ID = new Map(posts.map((p) => [p.id, p]));

// Make sure the saved state has a feed for today; build a new one if the day changed.
function withToday(state) {
  const key = todayKey();
  const hasPosts = state.today.ids.some((id) => BY_ID.has(id));
  if (state.today.date === key && hasPosts) return state;
  const { ids, seen } = pickIds(ALL_IDS, state.done, state.seen, DAILY_COUNT);
  return { ...state, seen, today: { date: key, ids, viewed: 0 } };
}

export default function App() {
  const [state, setState] = useState(null);
  const [view, setView] = useState("today");
  const [reader, setReader] = useState(null);
  const [themeTag, setThemeTag] = useState(null);

  // Load from the browser, then build today's feed.
  useEffect(() => {
    setState(withToday(loadState()));
  }, []);

  // Save every change.
  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  // If the app stays open past midnight, start a fresh feed when you come back to it.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") {
        setState((s) => (s ? withToday(s) : s));
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Escape closes the reader.
  useEffect(() => {
    if (!reader) return;
    function onKey(event) {
      if (event.key === "Escape") setReader(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reader]);

  const savedSet = useMemo(() => new Set(state?.saved ?? []), [state]);
  const doneSet = useMemo(() => new Set(state?.done ?? []), [state]);
  const todayPosts = useMemo(
    () => (state?.today.ids ?? []).map((id) => BY_ID.get(id)).filter(Boolean),
    [state]
  );
  const savedPosts = useMemo(
    () => (state?.saved ?? []).map((id) => BY_ID.get(id)).filter(Boolean).reverse(),
    [state]
  );

  function toggle(field, id) {
    setState((s) => {
      const has = s[field].includes(id);
      return { ...s, [field]: has ? s[field].filter((x) => x !== id) : [...s[field], id] };
    });
  }

  // Infinite scroll: add more posts to today's feed when you get near the end.
  const loadMore = useCallback(() => {
    setState((s) => {
      if (!s) return s;
      const more = pickMore(ALL_IDS, s.done, s.seen, s.today.ids, LOAD_COUNT);
      if (!more || more.ids.length === 0) return s;
      return { ...s, seen: more.seen, today: { ...s.today, ids: [...s.today.ids, ...more.ids] } };
    });
  }, []);

  // The feed reports how far you scrolled; this drives the daily streak.
  const onViewed = useCallback((count) => {
    setState((s) => (s ? recordViewed(s, count) : s));
  }, []);

  function resetAll() {
    setReader(null);
    setState(withToday(EMPTY_STATE));
    setView("today");
  }

  if (!state) return <div className="shell" style={tagStyle(null)} />;

  const activeTag = reader ? reader.tag : view === "today" ? themeTag : null;

  return (
    <div className="shell" style={tagStyle(activeTag)}>
      <div className="views">
        <div className="view" hidden={view !== "today"}>
          <Feed
            posts={todayPosts}
            savedSet={savedSet}
            doneSet={doneSet}
            savedCount={state.saved.length}
            canMore={state.today.ids.length < ALL_IDS.length}
            streak={liveStreak(state.streak)}
            bestStreak={state.streak.best}
            streakDays={state.streak.days}
            viewedToday={state.today.viewed || 0}
            visible={view === "today" && !reader}
            onSave={(id) => toggle("saved", id)}
            onDone={(id) => toggle("done", id)}
            onMore={loadMore}
            onViewed={onViewed}
            onActiveTag={setThemeTag}
            onGoSaved={() => setView("saved")}
          />
        </div>

        <div className="view" hidden={view !== "library"}>
          <Library posts={posts} savedSet={savedSet} doneSet={doneSet} onOpen={setReader} />
        </div>

        <div className="view" hidden={view !== "saved"}>
          <Saved
            posts={savedPosts}
            savedSet={savedSet}
            doneSet={doneSet}
            onOpen={setReader}
            onReset={resetAll}
          />
        </div>

        {reader ? (
          <div className="reader">
            <button type="button" className="back" onClick={() => setReader(null)}>
              <BackIcon size={20} />
              Back
            </button>
            <div className="card">
              <PostCard
                post={reader}
                saved={savedSet.has(reader.id)}
                done={doneSet.has(reader.id)}
                onSave={(id) => toggle("saved", id)}
                onDone={(id) => toggle("done", id)}
              />
            </div>
          </div>
        ) : null}
      </div>

      <Nav
        view={view}
        onChange={(next) => {
          setReader(null);
          setView(next);
        }}
        savedCount={state.saved.length}
      />
    </div>
  );
}
