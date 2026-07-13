export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-foreground/70 sm:px-6">
        <p className="font-serif text-base font-semibold text-foreground">
          Full Gospel Christian Assembly
        </p>
        <p className="mt-4 text-xs text-foreground/50">
          &copy; {new Date().getFullYear()} The Message. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
