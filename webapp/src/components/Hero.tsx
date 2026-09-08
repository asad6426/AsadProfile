import Image from "next/image";
import type { Profile } from "@/lib/types";

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section id="top" className="border-b border-border bg-muted">
      <div className="section-container flex flex-col-reverse items-center gap-10 py-16 md:flex-row md:py-24">
        <div className="flex-1 text-center md:text-left">
          <p className="section-eyebrow mb-3">Hello, I&apos;m</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-xl font-semibold text-primary">{profile.title}</p>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:mx-0">
            {profile.about}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#contact"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
            >
              Contact Me
            </a>
            <a
              href="#projects"
              className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              View Work
            </a>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-background bg-background shadow-lg sm:h-52 sm:w-52">
            {profile.photo ? (
              <Image
                src={profile.photo}
                alt={profile.name}
                width={208}
                height={208}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
