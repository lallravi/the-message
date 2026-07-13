import Link from "next/link";
import { auth, signOut } from "@/auth";
import MobileMenu from "@/components/MobileMenu";

export default async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const links = [
    { href: "/", label: "Home" },
    { href: "/the-message", label: "The Message" },
    ...(isAdmin ? [{ href: "/admin/users", label: "Admin" }] : []),
  ];

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          The Message
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </nav>

        <MobileMenu
          links={links}
          signOutAction={session?.user ? signOutAction : undefined}
        />
      </div>
    </header>
  );
}
