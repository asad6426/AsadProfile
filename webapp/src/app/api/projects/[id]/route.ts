import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProjects, saveProjects } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Project } from "@/lib/types";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json()) as Partial<Project>;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  projects[index] = { ...projects[index], ...body, id };
  await saveProjects(projects);
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json(projects[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  await saveProjects(filtered);
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
