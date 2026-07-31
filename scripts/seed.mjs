// Seeds Supabase (storage + tables) from the extracted PDF content in
// src/content/entries.json and the images copied into public/tirtha-images.
//
// Usage:  node scripts/seed.mjs
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
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

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
const IMAGES_DIR = path.join(ROOT, "public/tirtha-images");

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === "tirtha-images")) {
    const { error } = await supabase.storage.createBucket("tirtha-images", {
      public: true,
    });
    if (error) throw error;
    console.log("Created storage bucket tirtha-images");
  }
}

async function uploadImage(filename) {
  const filePath = path.join(IMAGES_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  const contentType = filename.endsWith(".png") ? "image/png" : "image/jpeg";
  const { error } = await supabase.storage
    .from("tirtha-images")
    .upload(filename, buffer, { contentType, upsert: true });
  if (error) throw error;
}

async function seedAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("Skipping admin user creation (set ADMIN_EMAIL + ADMIN_PASSWORD to enable).");
    return;
  }
  const { data: existing } = await supabase.auth.admin.listUsers();
  let user = existing?.users?.find((u) => u.email === ADMIN_EMAIL);
  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
    console.log(`Created admin auth user ${ADMIN_EMAIL}`);
  }
  const { error: insErr } = await supabase
    .from("admins")
    .upsert({ email: ADMIN_EMAIL }, { onConflict: "email" });
  if (insErr) throw insErr;
  console.log(`Granted admin access to ${ADMIN_EMAIL}`);
}

async function main() {
  await ensureBucket();

  const uploadedFiles = new Set();

  for (const e of entries) {
    for (const im of e.images) {
      if (uploadedFiles.has(im.filename)) continue;
      await uploadImage(im.filename);
      uploadedFiles.add(im.filename);
    }
    process.stdout.write(`\ruploaded images: ${uploadedFiles.size}`);
  }
  console.log(`\nUploaded ${uploadedFiles.size} unique images.`);

  for (const e of entries) {
    const row = {
      entry_number: e.entry_number,
      slug: e.slug,
      title: e.title,
      city: e.city,
      state: e.state,
      mulnayak_text: e.mulnayak_text,
      tirth_text: e.tirth_text,
      history_text: e.history_text,
      other_temples_text: e.other_temples_text,
      directions_text: e.directions_text,
      shastra_text: e.shastra_text,
      raw_text: e.raw_text,
      maps_url: e.maps_url,
      phone: e.phone,
      cover_image_path: e.cover_image_filename,
      source_pages: e.source_pages,
      sort_order: e.entry_number,
      published: true,
    };

    const { data: tirtha, error } = await supabase
      .from("tirthas")
      .upsert(row, { onConflict: "slug" })
      .select()
      .single();
    if (error) throw error;

    await supabase.from("tirtha_images").delete().eq("tirtha_id", tirtha.id);
    if (e.images.length > 0) {
      const imageRows = e.images.map((im, i) => ({
        tirtha_id: tirtha.id,
        storage_path: im.filename,
        width: im.width,
        height: im.height,
        sort_order: i,
      }));
      const { error: imgErr } = await supabase.from("tirtha_images").insert(imageRows);
      if (imgErr) throw imgErr;
    }
    process.stdout.write(`\rseeded entries: ${e.entry_number}/${entries.length}`);
  }
  console.log(`\nSeeded ${entries.length} tirthas.`);

  await seedAdmin();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
