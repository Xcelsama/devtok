"use client";

import PostList from "./PostList";

// Posts you bookmarked, plus a way to start over.
export default function Saved({ posts, savedSet, doneSet, onOpen, onReset }) {
  function confirmReset() {
    if (window.confirm("Clear all saved posts, Got it marks and today's feed?")) onReset();
  }

  return (
    <div className="page">
      <h1 className="page-title">Saved</h1>
      <p className="page-sub">Posts you want to come back to</p>

      <PostList
        posts={posts}
        savedSet={savedSet}
        doneSet={doneSet}
        onOpen={onOpen}
        empty="Nothing saved yet. Tap Save on any post and it shows up here."
      />

      <button type="button" className="btn reset" onClick={confirmReset}>
        Reset all progress
      </button>
    </div>
  );
}
