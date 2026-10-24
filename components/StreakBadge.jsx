"use client";

import { useEffect, useState } from "react";
import { FlameIcon } from "./icons";
import { STREAK_GOAL, lastSevenDays } from "@/lib/streak";

// Flame pill in the corner of the feed. Tap it to see your streak and the last 7 days.
export default function StreakBadge({ streak, best, days, viewedToday }) {
  const [open, setOpen] = useState(false);
  const goalMet = viewedToday >= STREAK_GOAL;
  const week = lastSevenDays({ days });

  // Escape closes the sheet.
  useEffect(() => {
    if (!open) return;
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const left = Math.max(STREAK_GOAL - viewedToday, 0);
  const message = goalMet
    ? "Today counts. Come back tomorrow to keep it going."
    : streak > 0
      ? `Read ${left} more ${left === 1 ? "post" : "posts"} today to keep your streak.`
      : `Read ${left} ${left === 1 ? "post" : "posts"} today to start a streak.`;

  return (
    <>
      <button
        type="button"
        className={`streak-pill${goalMet ? " lit" : ""}`}
        onClick={() => setOpen(true)}
        aria-label={`Daily streak: ${streak} ${streak === 1 ? "day" : "days"}. Open details.`}
      >
        <FlameIcon size={16} filled={goalMet} />
        {streak}
      </button>

      {open ? (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Daily streak"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-top">
              <span className={`sheet-flame${goalMet ? " lit" : ""}`}>
                <FlameIcon size={30} filled={goalMet} />
              </span>
              <div>
                <p className="sheet-big">
                  {streak} {streak === 1 ? "day" : "days"}
                </p>
                <p className="sheet-small">Best: {Math.max(best, streak)}</p>
              </div>
            </div>

            <ul className="week" aria-label="Last 7 days">
              {week.map((d) => (
                <li key={d.key} className={`${d.active ? "hit" : ""}${d.today ? " today" : ""}`}>
                  <span className="week-dot">{d.active ? "✓" : ""}</span>
                  <span className="week-label">{d.label}</span>
                </li>
              ))}
            </ul>

            <p className="sheet-msg">{message}</p>
            <button type="button" className="btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
