import ScriptureQuote from "@/components/ScriptureQuote";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <section className="text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          The Message of the Hour
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/70 sm:text-lg">
          Welcome to The Message. We are a community gathered around the
          Word of God, earnestly contending for the faith once delivered
          unto the saints.
        </p>
      </section>

      <section className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2">
        <ScriptureQuote reference="Romans 10:17">
          So then faith cometh by hearing, and hearing by the word of God.
        </ScriptureQuote>
        <ScriptureQuote reference="Jude 1:3">
          &hellip;that ye should earnestly contend for the faith which was
          once delivered unto the saints.
        </ScriptureQuote>
      </section>
    </div>
  );
}
