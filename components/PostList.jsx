"use client";

import { tagMeta } from "@/lib/tags";
import { BookmarkIcon, CheckIcon } from "./icons";

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

// A tappable list of posts, used by Library and Saved.
export default function PostList({ posts, savedSet, doneSet, onOpen, empty }) {
  if (posts.length === 0) return <p className="empty">{empty}</p>;

  return (
    <ul className="list">
      {posts.map((post) => {
        const meta = tagMeta(post.tag);
        return (
          <li key={post.id}>
            <button
              type="button"
              className="row"
              style={{ "--row-accent": meta.accent }}
              onClick={() => onOpen(post)}
            >
              <span>
                <span className="row-title">{post.title}</span>
                <span className="row-sub">
                  {meta.label}, {post.level}
                </span>
              </span>
              <span className="row-flags">
                {savedSet.has(post.id) ? <BookmarkIcon filled size={18} aria-label="Saved" /> : null}
                {doneSet.has(post.id) ? <CheckIcon size={18} aria-label="Got it" /> : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
