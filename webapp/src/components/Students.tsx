import Image from "next/image";
import Link from "next/link";
import type { Student } from "@/lib/types";

export default function Students({ students }: { students: Student[] }) {
  const approved = students.filter((s) => s.status === "approved");

  return (
    <section id="students" className="py-20">
      <div className="section-container">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow">My Trainees</p>
            <h2 className="section-heading mt-1">Students</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              I&apos;ve trained many students over the years. Here are some of them — where they
              work now and what they&apos;re open to.
            </p>
          </div>
          <Link
            href="/students/join"
            className="whitespace-nowrap rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
          >
            Add Your Info
          </Link>
        </div>

        {approved.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No students listed yet. Share the &quot;Add Your Info&quot; link with your trainees so
            they can appear here.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map((student) => (
              <div
                key={student.id}
                className="flex flex-col items-center rounded-xl border border-border bg-background p-6 text-center shadow-sm"
              >
                <div className="h-20 w-20 overflow-hidden rounded-full bg-primary/10">
                  {student.image ? (
                    <Image
                      src={student.image}
                      alt={student.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                </div>

                <h3 className="mt-4 font-bold text-foreground">{student.name}</h3>
                {student.currentJob && (
                  <p className="mt-1 text-sm font-medium text-primary">{student.currentJob}</p>
                )}
                {student.address && (
                  <p className="mt-1 text-xs text-muted-foreground">{student.address}</p>
                )}
                {student.workArea && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Works in:</span>{" "}
                    {student.workArea}
                  </p>
                )}
                {student.availability && (
                  <span className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {student.availability}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
