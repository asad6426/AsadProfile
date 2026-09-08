export default function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-border py-6">
      <div className="section-container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <a href="/admin-login" className="hover:text-primary">
          Admin
        </a>
      </div>
    </footer>
  );
}
