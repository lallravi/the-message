"use client";

import Link from "next/link";
import { useState } from "react";

type NavLink = {
  href: string;
  label: string;
};

export default function MobileMenu({
  links,
  signOutAction,
}: {
  links: NavLink[];
  signOutAction?: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {open ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-border bg-background px-4 pb-4 pt-2 shadow-sm">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}

            {signOutAction ? (
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full rounded-md px-3 py-2 text-left text-base font-medium text-foreground hover:bg-muted"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-accent hover:bg-muted"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
