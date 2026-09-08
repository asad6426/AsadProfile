"use client";

import { useState } from "react";
import type { Profile, Project, Student } from "@/lib/types";
import ProfileEditor from "./ProfileEditor";
import ProjectsEditor from "./ProjectsEditor";
import StudentsManager from "./StudentsManager";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "projects", label: "Projects" },
  { key: "students", label: "Students" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminTabs({
  profile,
  projects,
  students,
}: {
  profile: Profile;
  projects: Project[];
  students: Student[];
}) {
  const [tab, setTab] = useState<TabKey>("profile");
  const pendingCount = students.filter((s) => s.status === "pending").length;

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-3 text-sm font-semibold ${
              tab === t.key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {t.key === "students" && pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        {tab === "profile" && <ProfileEditor initialProfile={profile} />}
        {tab === "projects" && <ProjectsEditor initialProjects={projects} />}
        {tab === "students" && <StudentsManager initialStudents={students} />}
      </div>
    </div>
  );
}
