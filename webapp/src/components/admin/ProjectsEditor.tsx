"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";

const EMPTY: Omit<Project, "id"> = {
  title: "",
  description: "",
  image: null,
  tags: [],
  link: "",
  github: "",
  featured: false,
};

export default function ProjectsEditor({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [draft, setDraft] = useState<Omit<Project, "id">>(EMPTY);
  const [tagsText, setTagsText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function startEdit(project: Project) {
    setEditingId(project.id);
    setDraft({ ...project });
    setTagsText(project.tags.join(", "));
  }

  function resetForm() {
    setEditingId(null);
    setDraft(EMPTY);
    setTagsText("");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("subdir", "projects");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setDraft((d) => ({ ...d, image: data.url }));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!draft.title.trim()) {
      setMessage("Title is required");
      return;
    }
    setSaving(true);
    setMessage("");

    const payload = {
      ...draft,
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        if (!res.ok) throw new Error("Update failed");
        setProjects((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        if (!res.ok) throw new Error("Create failed");
        setProjects((prev) => [created, ...prev]);
      }
      resetForm();
      setMessage("Saved!");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Title</span>
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="field-input"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Description
            </span>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              className="field-input min-h-24"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Live Link
            </span>
            <input
              value={draft.link}
              onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
              placeholder="https://..."
              className="field-input"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              GitHub Link
            </span>
            <input
              value={draft.github}
              onChange={(e) => setDraft((d) => ({ ...d, github: e.target.value }))}
              placeholder="https://github.com/..."
              className="field-input"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Tags (comma separated)
            </span>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Django, React, PostgreSQL"
              className="field-input"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
              className="h-4 w-4"
            />
            <span className="text-sm text-foreground">Featured</span>
          </label>

          <div>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Image</span>
            <div className="flex items-center gap-3">
              {draft.image && (
                <Image
                  src={draft.image}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <label className="cursor-pointer rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20">
                {uploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          )}
          {message && <span className="text-sm font-medium text-muted-foreground">{message}</span>}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          All Projects ({projects.length})
        </h3>
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3">
                {project.image && (
                  <Image
                    src={project.image}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-foreground">{project.title}</p>
                  <p className="text-xs text-muted-foreground">{project.tags.join(", ")}</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm font-medium">
                <button onClick={() => startEdit(project)} className="text-primary hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
