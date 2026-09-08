import type { Profile } from "@/lib/types";

export default function Contact({ profile }: { profile: Profile }) {
  const socialEntries = Object.entries(profile.social || {}).filter(([, v]) => v);

  return (
    <section id="contact" className="border-t border-border bg-muted py-20">
      <div className="section-container max-w-2xl text-center">
        <p className="section-eyebrow">Get In Touch</p>
        <h2 className="section-heading mt-1">Contact</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Have a project, training request, or just want to say hello? Reach out.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="rounded-lg border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
            >
              {profile.email}
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="rounded-lg border border-border bg-background p-4 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
            >
              {profile.phone}
            </a>
          )}
          {profile.address && (
            <div className="rounded-lg border border-border bg-background p-4 text-sm font-medium text-foreground">
              {profile.address}
            </div>
          )}
        </div>

        {socialEntries.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {socialEntries.map(([key, value]) => (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium capitalize text-foreground hover:border-primary hover:text-primary"
              >
                {key}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
