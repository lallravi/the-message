import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Saves an uploaded audio file and returns its public URL. Uses Vercel Blob
 * when BLOB_READ_WRITE_TOKEN is configured (required in production, since
 * serverless hosts have no persistent local disk); otherwise falls back to
 * writing under /public/uploads for local dev.
 */
export async function saveAudioFile(file: File): Promise<string> {
  const ext = path.extname(file.name) || ".mp3";
  const filename = `${randomUUID()}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}
