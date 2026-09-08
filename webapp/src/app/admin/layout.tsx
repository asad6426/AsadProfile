import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen bg-muted">
      <AdminHeader />
      <div className="section-container py-8">{children}</div>
    </div>
  );
}
