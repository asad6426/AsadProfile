import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStudents, saveStudents } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Student } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json()) as Partial<Student>;
  const students = await getStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  students[index] = { ...students[index], ...body, id };
  await saveStudents(students);
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json(students[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const students = await getStudents();
  const filtered = students.filter((s) => s.id !== id);
  await saveStudents(filtered);
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
