import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { getProjects, saveProjects } from "@/lib/data";
import { isAdminAuthenticated } from "@/lib/auth";
import type { Project } from "@/lib/types";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<Project>;
  const projects = await getProjects();

  const newProject: Project = {
    id: crypto.randomUUID(),
    title: body.title || "Untitled Project",
    description: body.description || "",
    image: body.image ?? null,
    tags: body.tags || [],
    link: body.link || "",
    github: body.github || "",
    featured: body.featured ?? false,
  };

  projects.unshift(newProject);
  await saveProjects(projects);
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json(newProject, { status: 201 });
}
