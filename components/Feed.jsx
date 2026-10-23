"use client";

import { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import { BONUS_COUNT } from "@/lib/daily";

// The vertical, snap-scrolling feed of today's posts.
export default function Feed({
  posts,
  savedSet,
  doneSet,
  savedCount,
  canMore,
  visible,
  onSave,
  onDone,
  onMore,
  onActiveTag,
  onGoSaved,
}) {
  const listRef = useRef(null);
  const prevLength = useRef(posts.length);
  const [active, setActive] = useState(0);

  // Track which card is on screen.
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        }
      },
      { root, threshold: 0.6 }
    );
    root.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts.length]);

  // Tell the app which colour to fade to.
  useEffect(() => {
    if (visible) onActiveTag(posts[active]?.tag ?? null);
  }, [active, visible, posts, onActiveTag]);

  // After "show more", jump to the first new post.
  useEffect(() => {
    if (posts.length > prevLength.current) scrollToIndex(prevLength.current);
    prevLength.current = posts.length;
  }, [posts.length]);

  // j / k and arrow keys on desktop.
  useEffect(() => {
    if (!visible) return;
    function onKey(event) {
      if (event.target.closest?.("input, textarea")) return;
      if (event.key === "j" || event.key === "ArrowDown") {
        event.preventDefault();
        scrollToIndex(active + 1);
      } else if (event.key === "k" || event.key === "ArrowUp") {
        event.preventDefault();
        scrollToIndex(active - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, active]);

  function scrollToIndex(index) {
    const el = listRef.current?.querySelector(`[data-index="${index}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleDone(id, index) {
    const wasDone = doneSet.has(id);
    onDone(id);
    if (!wasDone) setTimeout(() => scrollToIndex(index + 1), 250);
  }

  const doneToday = posts.filter((p) => doneSet.has(p.id)).length;

  return (
    <div className="feed-wrap">
      <div className="progress" aria-hidden="true">
        {posts.map((post, i) => (
          <span key={post.id} className={i <= active ? "on" : ""} />
        ))}
      </div>

      <div className="feed" ref={listRef}>
        {posts.map((post, i) => (
          <section className="card" data-index={i} key={post.id}>
            <PostCard
              post={post}
              saved={savedSet.has(post.id)}
              done={doneSet.has(post.id)}
              onSave={onSave}
              onDone={(id) => handleDone(id, i)}
            />
          </section>
        ))}

        <section className="card end" data-index={posts.length}>
          <div className="post end-inner">
            <h2 className="title">That&rsquo;s everything for today.</h2>
            <p className="explain">
              You reached the end of today&rsquo;s {posts.length} posts and marked {doneToday} as
              &ldquo;Got it&rdquo;. Close the app and build something with one of them. New posts
              arrive tomorrow.
            </p>
            <div className="end-actions">
              {canMore ? (
                <button type="button" className="btn" onClick={onMore}>
                  Show {BONUS_COUNT} more
                </button>
              ) : null}
              <button type="button" className="btn" onClick={onGoSaved}>
                Review saved posts ({savedCount})
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
