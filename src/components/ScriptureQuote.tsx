export default function ScriptureQuote({
  reference,
  children,
}: {
  reference: string;
  children: React.ReactNode;
}) {
  return (
    <blockquote className="group relative rounded-2xl border border-border bg-background p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-10">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-3 left-6 font-display text-7xl leading-none text-accent/20"
      >
        &ldquo;
      </span>
      <p className="relative font-serif text-xl italic leading-relaxed text-foreground sm:text-2xl">
        {children}
      </p>
      <footer className="mt-5 text-sm font-semibold tracking-wide text-accent">
        — {reference}
      </footer>
    </blockquote>
  );
}
