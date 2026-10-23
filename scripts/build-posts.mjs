// Merges every file in content/posts/*.json into data/posts.json.
// Run it after adding or editing a post:  npm run content
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = "content/posts";
const required = ["id", "tag", "level", "title", "why_it_matters", "explanation", "try_it", "read_time_sec"];

const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const posts = [];
const seen = new Set();

for (const file of files) {
  let post;
  try {
    post = JSON.parse(readFileSync(join(dir, file), "utf8"));
  } catch (err) {
    console.error(`Invalid JSON in ${file}: ${err.message}`);
    process.exit(1);
  }
  const missing = required.filter((key) => post[key] === undefined);
  if (missing.length) {
    console.error(`${file} is missing: ${missing.join(", ")}`);
    process.exit(1);
  }
  if (seen.has(post.id)) {
    console.error(`Duplicate id "${post.id}" in ${file}`);
    process.exit(1);
  }
  seen.add(post.id);
  posts.push(post);
}

posts.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync("data/posts.json", JSON.stringify(posts));
console.log(`Wrote data/posts.json with ${posts.length} posts.`);
