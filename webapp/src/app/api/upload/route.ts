import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/upload";
import { isAdminAuthenticated } from "@/lib/auth";

const PUBLIC_SUBDIRS = new Set(["students"]);
const ADMIN_ONLY_SUBDIRS = new Set(["profile", "projects"]);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const subdirRaw = formData.get("subdir");
  const subdir = typeof subdirRaw === "string" ? subdirRaw : "";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (ADMIN_ONLY_SUBDIRS.has(subdir)) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (!PUBLIC_SUBDIRS.has(subdir)) {
    return NextResponse.json({ error: "Invalid upload target" }, { status: 400 });
  }

  try {
    const url = await saveUploadedImage(file, subdir);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
