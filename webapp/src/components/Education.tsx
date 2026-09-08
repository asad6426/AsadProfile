import type { CertificationItem, EducationItem, AwardItem } from "@/lib/types";

export default function Education({
  education,
  certifications,
  awards,
}: {
  education: EducationItem[];
  certifications: CertificationItem[];
  awards: AwardItem[];
}) {
  if (!education.length && !certifications.length && !awards.length) return null;

  return (
    <section id="education" className="py-20">
      <div className="section-container">
        <p className="section-eyebrow">Background</p>
        <h2 className="section-heading mt-1">Education &amp; Certifications</h2>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {education.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Education
              </h3>
              <div className="space-y-5">
                {education.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border p-4">
                    <p className="text-xs font-semibold text-primary">{item.period}</p>
                    <h4 className="mt-1 font-bold text-foreground">{item.degree}</h4>
                    <p className="text-sm text-muted-foreground">{item.institute}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-10">
            {certifications.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Certifications
                </h3>
                <ul className="space-y-3">
                  {certifications.map((item) => (
                    <li key={item.id} className="rounded-lg border border-border p-4">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.organization} &middot; {item.year}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {awards.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Awards
                </h3>
                <ul className="space-y-3">
                  {awards.map((item) => (
                    <li key={item.id} className="rounded-lg border border-border p-4">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.organization} &middot; {item.year}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
