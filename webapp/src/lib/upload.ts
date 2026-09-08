import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function saveUploadedImage(file: File, subdir: string): Promise<string> {
  if (!ALLOWED_TYPES[file.type]) {
    throw new Error("Unsupported image type. Use JPG, PNG, WEBP or GIF.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Image is too large. Max size is 5MB.");
  }

  const ext = ALLOWED_TYPES[file.type];
  const filename = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", subdir);
  await fs.mkdir(dir, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(path.join(dir, filename), Buffer.from(arrayBuffer));

  return `/uploads/${subdir}/${filename}`;
}
