"use client";

import { useState } from "react";
import Image from "next/image";
import type { Student, StudentStatus } from "@/lib/types";

const STATUS_STYLES: Record<StudentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function StudentsManager({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filter, setFilter] = useState<"all" | StudentStatus>("pending");

  async function updateStatus(id: string, status: StudentStatus) {
    const res = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this student entry?")) return;
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  }

  const visible = students.filter((s) => filter === "all" || s.status === filter);
  const counts = {
    all: students.length,
    pending: students.filter((s) => s.status === "pending").length,
    approved: students.filter((s) => s.status === "approved").length,
    rejected: students.filter((s) => s.status === "rejected").length,
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${
              filter === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {key} ({counts[key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No entries in this list. Share the{" "}
          <a href="/students/join" target="_blank" className="text-primary hover:underline">
            student submission link
          </a>{" "}
          with your trainees.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((student) => (
            <div key={student.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-primary/10">
                    {student.image ? (
                      <Image
                        src={student.image}
                        alt={student.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
                        {student.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{student.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLES[student.status]}`}
                      >
                        {student.status}
                      </span>
                    </div>
                    {student.currentJob && (
                      <p className="text-sm text-muted-foreground">{student.currentJob}</p>
                    )}
                    {student.address && (
                      <p className="text-xs text-muted-foreground">{student.address}</p>
                    )}
                    {student.workArea && (
                      <p className="text-xs text-muted-foreground">Area: {student.workArea}</p>
                    )}
                    {student.availability && (
                      <p className="text-xs text-muted-foreground">
                        Availability: {student.availability}
                      </p>
                    )}
                    {(student.email || student.phone) && (
                      <p className="text-xs text-muted-foreground">
                        {[student.email, student.phone].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {student.bio && (
                      <p className="mt-1 max-w-xl text-xs text-muted-foreground">{student.bio}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  {student.status !== "approved" && (
                    <button
                      onClick={() => updateStatus(student.id, "approved")}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  {student.status !== "rejected" && (
                    <button
                      onClick={() => updateStatus(student.id, "rejected")}
                      className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
