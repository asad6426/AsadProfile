"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin-login");
    router.refresh();
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="section-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-foreground">Admin Panel</span>
          <Link href="/" target="_blank" className="text-sm font-medium text-primary hover:underline">
            View Site &rarr;
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
