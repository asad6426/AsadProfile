import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProfile, saveProfile } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Profile;
  await saveProfile(body);
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
