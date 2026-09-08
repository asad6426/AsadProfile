import { getProfile, getProjects, getStudents } from "@/lib/data";
import AdminTabs from "@/components/admin/AdminTabs";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [profile, projects, students] = await Promise.all([
    getProfile(),
    getProjects(),
    getStudents(),
  ]);

  return <AdminTabs profile={profile} projects={projects} students={students} />;
}
