"use client";

import { BoltIcon, BookmarkIcon, LibraryIcon } from "./icons";

const ITEMS = [
  { id: "today", label: "Today", Icon: BoltIcon },
  { id: "library", label: "Library", Icon: LibraryIcon },
  { id: "saved", label: "Saved", Icon: BookmarkIcon },
];

export default function Nav({ view, onChange, savedCount }) {
  return (
    <nav className="nav" aria-label="Main">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          type="button"
          key={id}
          aria-current={view === id ? "page" : undefined}
          onClick={() => onChange(id)}
        >
          <Icon size={22} />
          {label}
          {id === "saved" && savedCount > 0 ? <span className="badge">{savedCount}</span> : null}
        </button>
      ))}
    </nav>
  );
}
