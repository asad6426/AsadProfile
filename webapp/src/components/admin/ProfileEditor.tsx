"use client";

import { useState } from "react";
import Image from "next/image";
import type { Profile } from "@/lib/types";
import ArrayEditor from "./ArrayEditor";
import StringListEditor from "./StringListEditor";

function cleanProfile(profile: Profile): Profile {
  return {
    ...profile,
    experience: profile.experience.map((e) => ({
      ...e,
      points: e.points.map((p) => p.trim()).filter(Boolean),
    })),
  };
}

export default function ProfileEditor({ initialProfile }: { initialProfile: Profile }) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("subdir", "profile");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      set("photo", data.url as string);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanProfile(profile)),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("Saved!");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <div className="space-y-10">
      {/* Basic info */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Basic Info
        </h3>
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-3">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-primary/10">
              {profile.photo ? (
                <Image
                  src={profile.photo}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No photo
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20">
              {uploading ? "Uploading..." : "Change Photo"}
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Name</span>
              <input
                value={profile.name}
                onChange={(e) => set("name", e.target.value)}
                className="field-input"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Title</span>
              <input
                value={profile.title}
                onChange={(e) => set("title", e.target.value)}
                className="field-input"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Email</span>
              <input
                value={profile.email}
                onChange={(e) => set("email", e.target.value)}
                className="field-input"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Phone</span>
              <input
                value={profile.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="field-input"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">
                Address
              </span>
              <input
                value={profile.address}
                onChange={(e) => set("address", e.target.value)}
                className="field-input"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">About</span>
              <textarea
                value={profile.about}
                onChange={(e) => set("about", e.target.value)}
                className="field-input min-h-24"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Social */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Social Links
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["github", "linkedin", "facebook", "website", "youtube", "twitter"] as const).map(
            (key) => (
              <label key={key}>
                <span className="mb-1 block text-xs font-medium capitalize text-muted-foreground">
                  {key}
                </span>
                <input
                  value={profile.social[key] || ""}
                  onChange={(e) =>
                    set("social", { ...profile.social, [key]: e.target.value })
                  }
                  placeholder="https://..."
                  className="field-input"
                />
              </label>
            )
          )}
        </div>
      </section>

      {/* Skills */}
      <section>
        <ArrayEditor
          title="Skills"
          items={profile.skills}
          onChange={(items) => set("skills", items)}
          fields={[
            { key: "name", label: "Skill Name" },
            { key: "level", label: "Level (0-100)", type: "number" },
          ]}
          emptyItem={() => ({ name: "", level: 50 })}
        />
      </section>

      <section>
        <StringListEditor
          title="Soft Skills"
          items={profile.softSkills}
          onChange={(items) => set("softSkills", items)}
        />
      </section>

      <section>
        <StringListEditor
          title="Languages"
          items={profile.languages}
          onChange={(items) => set("languages", items)}
        />
      </section>

      {/* Experience */}
      <section>
        <ArrayEditor
          title="Experience"
          items={profile.experience}
          onChange={(items) => set("experience", items)}
          fields={[
            { key: "title", label: "Job Title" },
            { key: "organization", label: "Organization" },
            { key: "period", label: "Period", placeholder: "e.g. Jan 2020 - Present" },
            { key: "points", label: "Responsibilities", type: "list" },
          ]}
          emptyItem={() => ({ title: "", organization: "", period: "", points: [] })}
        />
      </section>

      {/* Education */}
      <section>
        <ArrayEditor
          title="Education"
          items={profile.education}
          onChange={(items) => set("education", items)}
          fields={[
            { key: "degree", label: "Degree" },
            { key: "institute", label: "Institute" },
            { key: "period", label: "Period" },
            { key: "result", label: "Result" },
          ]}
          emptyItem={() => ({ degree: "", institute: "", period: "", result: "" })}
        />
      </section>

      {/* Certifications */}
      <section>
        <ArrayEditor
          title="Certifications"
          items={profile.certifications}
          onChange={(items) => set("certifications", items)}
          fields={[
            { key: "title", label: "Title" },
            { key: "organization", label: "Organization" },
            { key: "year", label: "Year" },
          ]}
          emptyItem={() => ({ title: "", organization: "", year: "" })}
        />
      </section>

      {/* Awards */}
      <section>
        <ArrayEditor
          title="Awards"
          items={profile.awards}
          onChange={(items) => set("awards", items)}
          fields={[
            { key: "title", label: "Title" },
            { key: "organization", label: "Organization" },
            { key: "year", label: "Year" },
          ]}
          emptyItem={() => ({ title: "", organization: "", year: "" })}
        />
      </section>

      {/* Extracurricular */}
      <section>
        <StringListEditor
          title="Extracurricular Activities"
          items={profile.extracurricular}
          onChange={(items) => set("extracurricular", items)}
        />
      </section>

      {/* References */}
      <section>
        <ArrayEditor
          title="References"
          items={profile.references}
          onChange={(items) => set("references", items)}
          fields={[
            { key: "name", label: "Name" },
            { key: "title", label: "Title" },
            { key: "organization", label: "Organization" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
          ]}
          emptyItem={() => ({ name: "", title: "", organization: "", email: "", phone: "" })}
        />
      </section>

      <div className="sticky bottom-4 flex items-center gap-4 rounded-lg border border-border bg-background p-4 shadow-lg">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {message && <span className="text-sm font-medium text-muted-foreground">{message}</span>}
      </div>
    </div>
  );
}
