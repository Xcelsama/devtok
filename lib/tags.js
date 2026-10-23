// One colour identity per topic. The feed background fades to these as you scroll.
// bg = deep tone behind the card, accent = bright tone used for highlights.
export const TAGS = {
  css: { label: "CSS", bg: "#1c1233", accent: "#b794ff" },
  javascript: { label: "JavaScript", bg: "#2a1f08", accent: "#ffc83d" },
  react: { label: "React", bg: "#082630", accent: "#4fd8f0" },
  nextjs: { label: "Next.js", bg: "#15171c", accent: "#e8eaee" },
  "supabase-sql": { label: "Supabase and SQL", bg: "#0a2a1c", accent: "#3ddc97" },
  "browser-apis": { label: "Browser APIs", bg: "#301410", accent: "#ff7a59" },
  "a11y-performance": { label: "Accessibility and speed", bg: "#0e1c3a", accent: "#6ea8ff" },
  "git-deploy": { label: "Git and deploy", bg: "#2e0f1e", accent: "#ff6b9d" },
  "ai-assisted-dev": { label: "AI-assisted dev", bg: "#1d2608", accent: "#c5f04a" },
  career: { label: "Career", bg: "#2a2216", accent: "#e8c98a" },
};

const FALLBACK = { label: "Dev", bg: "#14121f", accent: "#cfc8ff" };

export function tagMeta(tag) {
  return TAGS[tag] || { ...FALLBACK, label: tag };
}

export function tagStyle(tag) {
  const t = tagMeta(tag);
  return { "--bg": t.bg, "--accent": t.accent };
}
