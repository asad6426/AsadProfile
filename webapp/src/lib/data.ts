import fs from "fs/promises";
import path from "path";
import type { Profile, Project, Student } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const filePath = path.join(DATA_DIR, file);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getProfile(): Promise<Profile> {
  return readJson<Profile>("profile.json");
}

export function saveProfile(profile: Profile): Promise<void> {
  return writeJson("profile.json", profile);
}

export function getProjects(): Promise<Project[]> {
  return readJson<Project[]>("projects.json");
}

export function saveProjects(projects: Project[]): Promise<void> {
  return writeJson("projects.json", projects);
}

export function getStudents(): Promise<Student[]> {
  return readJson<Student[]>("students.json");
}

export function saveStudents(students: Student[]): Promise<void> {
  return writeJson("students.json", students);
}
