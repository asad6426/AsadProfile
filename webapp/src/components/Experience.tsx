import type { ExperienceItem } from "@/lib/types";

export default function Experience({ items }: { items: ExperienceItem[] }) {
  if (!items.length) return null;

  return (
    <section id="experience" className="py-20">
      <div className="section-container">
        <p className="section-eyebrow">Career</p>
        <h2 className="section-heading mt-1">Experience</h2>

        <div className="mt-10 space-y-8 border-l border-border pl-6">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.period}
              </p>
              <h3 className="mt-1 text-lg font-bold text-foreground">{item.title}</h3>
              <p className="text-sm font-medium text-muted-foreground">{item.organization}</p>
              {item.points.length > 0 && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {item.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
