import { getProfile, getProjects, getStudents } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Students from "@/components/Students";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects, students] = await Promise.all([
    getProfile(),
    getProjects(),
    getStudents(),
  ]);

  return (
    <>
      <Navbar name={profile.name} />
      <main className="flex-1">
        <Hero profile={profile} />
        <Experience items={profile.experience} />
        <Skills skills={profile.skills} softSkills={profile.softSkills} />
        <Education
          education={profile.education}
          certifications={profile.certifications}
          awards={profile.awards}
        />
        <Projects projects={projects} />
        <Students students={students} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
