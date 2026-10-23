"use client";

import { useMemo, useState } from "react";
import PostList from "./PostList";
import { SearchIcon } from "./icons";
import { TAGS } from "@/lib/tags";

// Every post, searchable and filterable by topic.
export default function Library({ posts, savedSet, doneSet, onOpen }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (tag !== "all" && post.tag !== tag) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.explanation.toLowerCase().includes(q) ||
        (post.code || "").toLowerCase().includes(q)
      );
    });
  }, [posts, query, tag]);

  return (
    <div className="page">
      <h1 className="page-title">Library</h1>
      <p className="page-sub">{filtered.length} of {posts.length} posts</p>

      <label className="search">
        <SearchIcon size={18} />
        <input
          type="search"
          placeholder="Search titles, text and code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="filters">
        <button type="button" className="filter" aria-pressed={tag === "all"} onClick={() => setTag("all")}>
          All
        </button>
        {Object.entries(TAGS).map(([key, meta]) => (
          <button
            type="button"
            key={key}
            className="filter"
            aria-pressed={tag === key}
            onClick={() => setTag(key)}
          >
            <span className="dot" style={{ background: meta.accent }} />
            {meta.label}
          </button>
        ))}
      </div>

      <PostList
        posts={filtered}
        savedSet={savedSet}
        doneSet={doneSet}
        onOpen={onOpen}
        empty="Nothing matches that search."
      />
    </div>
  );
}
