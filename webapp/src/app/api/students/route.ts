import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { getStudents, saveStudents } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Student } from "@/lib/types";

export async function GET(req: NextRequest) {
  const students = await getStudents();
  const wantsAll = req.nextUrl.searchParams.get("all") === "1";

  if (wantsAll) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(students);
  }

  return NextResponse.json(students.filter((s) => s.status === "approved"));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Student>;

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const students = await getStudents();

  const newStudent: Student = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    image: body.image ?? null,
    address: body.address || "",
    currentJob: body.currentJob || "",
    workArea: body.workArea || "",
    availability: body.availability || "",
    bio: body.bio || "",
    email: body.email || "",
    phone: body.phone || "",
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  students.unshift(newStudent);
  await saveStudents(students);
  revalidatePath("/admin");
  return NextResponse.json(newStudent, { status: 201 });
}
