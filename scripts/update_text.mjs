// Updates just the text fields (title/city/state/raw_text/section fields) on
// existing Supabase rows after re-transcription — no image re-upload needed.
//
// Usage:  node scripts/update_text.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const entries = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/content/entries.json"), "utf-8"),
);

async function main() {
  for (const e of entries) {
    const { error } = await supabase
      .from("tirthas")
      .update({
        title: e.title,
        city: e.city,
        state: e.state,
        raw_text: e.raw_text,
        mulnayak_text: e.mulnayak_text,
        tirth_text: e.tirth_text,
        history_text: e.history_text,
        other_temples_text: e.other_temples_text,
        directions_text: e.directions_text,
        shastra_text: e.shastra_text,
      })
      .eq("slug", e.slug);
    if (error) throw error;
    process.stdout.write(`\rupdated: ${e.entry_number}/${entries.length}`);
  }
  console.log(`\nDone updating ${entries.length} entries.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
