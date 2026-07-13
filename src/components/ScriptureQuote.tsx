export default function ScriptureQuote({
  reference,
  children,
}: {
  reference: string;
  children: React.ReactNode;
}) {
  return (
    <blockquote className="rounded-lg border border-border bg-background/60 p-6 shadow-sm sm:p-8">
      <p className="font-serif text-xl italic leading-relaxed text-foreground sm:text-2xl">
        &ldquo;{children}&rdquo;
      </p>
      <footer className="mt-4 text-sm font-medium tracking-wide text-accent">
        — {reference}
      </footer>
    </blockquote>
  );
}
