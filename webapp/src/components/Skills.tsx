import type { SkillItem } from "@/lib/types";

export default function Skills({
  skills,
  softSkills,
}: {
  skills: SkillItem[];
  softSkills: string[];
}) {
  if (!skills.length && !softSkills.length) return null;

  return (
    <section id="skills" className="border-t border-border bg-muted py-20">
      <div className="section-container">
        <p className="section-eyebrow">What I Know</p>
        <h2 className="section-heading mt-1">Skills</h2>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {skills.length > 0 && (
            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {softSkills.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
