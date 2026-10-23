"use client";

import { useState } from "react";
import { tagMeta } from "@/lib/tags";
import { BookmarkIcon, CheckIcon, CopyIcon } from "./icons";

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

// One post. The wrapper around it (Feed or Reader) decides the size and background.
export default function PostCard({ post, saved, done, onSave, onDone }) {
  const [copied, setCopied] = useState(false);
  const meta = tagMeta(post.tag);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(post.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; nothing else to do.
    }
  }

  return (
    <article className="post">
      <header className="meta">
        <span className="chip">{meta.label}</span>
        <span>{capitalize(post.level)}</span>
        <span className="spacer">{post.read_time_sec} sec read</span>
      </header>

      {post.image ? <img className="post-img" src={post.image} alt="" /> : null}

      <h2 className="title">{post.title}</h2>
      <p className="why">{post.why_it_matters}</p>
      <p className="explain">{post.explanation}</p>

      {post.code ? (
        <div className="code">
          <div className="code-head">
            <span>{post.language || "code"}</span>
            <button type="button" className="icon-btn" onClick={copyCode} aria-label="Copy code">
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre>
            <code>{post.code}</code>
          </pre>
        </div>
      ) : null}

      <p className="try">
        <b>Try it:</b> {post.try_it}
      </p>

      <div className="actions">
        <button
          type="button"
          className={`btn${saved ? " on" : ""}`}
          aria-pressed={saved}
          onClick={() => onSave(post.id)}
        >
          <BookmarkIcon filled={saved} size={20} />
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          className={`btn${done ? " on" : ""}`}
          aria-pressed={done}
          onClick={() => onDone(post.id)}
        >
          <CheckIcon size={20} />
          Got it
        </button>
      </div>
    </article>
  );
}
