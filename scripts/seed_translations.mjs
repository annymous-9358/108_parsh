// Merges translated batches (extraction/output/translations/<lang>/batch_*.json)
// into the public.tirtha_translations table.
//
// Usage:  node scripts/seed_translations.mjs <lang_code> [<lang_code> ...]
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

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
const EXTRACTION_OUT = path.resolve(ROOT, "../extraction/output");

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const langs = process.argv.slice(2);
if (langs.length === 0) {
  console.error("Usage: node scripts/seed_translations.mjs <lang_code> [<lang_code> ...]");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // entry_number -> tirtha id
  const { data: tirthas, error } = await supabase.from("tirthas").select("id, entry_number");
  if (error) throw error;
  const idByEntryNumber = new Map(tirthas.map((t) => [t.entry_number, t.id]));

  for (const lang of langs) {
    const dir = path.join(EXTRACTION_OUT, "translations", lang);
    if (!fs.existsSync(dir)) {
      console.error(`No translations found for lang "${lang}" at ${dir}`);
      continue;
    }
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
    let count = 0;
    for (const file of files) {
      const items = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
      const rows = items
        .map((it) => {
          const tirtha_id = idByEntryNumber.get(it.entry_number);
          if (!tirtha_id) return null;
          return {
            tirtha_id,
            lang_code: lang,
            title: it.title || null,
            city: it.city || null,
            state: it.state || null,
            raw_text: it.raw_text || null,
          };
        })
        .filter(Boolean);

      const { error: upErr } = await supabase
        .from("tirtha_translations")
        .upsert(rows, { onConflict: "tirtha_id,lang_code" });
      if (upErr) throw upErr;
      count += rows.length;
      process.stdout.write(`\r[${lang}] upserted: ${count}`);
    }
    console.log(`\n[${lang}] done — ${count} translations.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
