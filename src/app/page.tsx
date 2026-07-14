import Link from "next/link";
import Image from "next/image";
import ScriptureQuote from "@/components/ScriptureQuote";

const HERO_OVERLAY = [
  "linear-gradient(to right, rgba(74,44,18,0.05) 0%, rgba(74,44,18,0.45) 45%, rgba(58,32,12,0.78) 75%, rgba(48,26,10,0.85) 100%)",
  "linear-gradient(to top, rgba(58,32,12,0.5), transparent 40%)",
].join(", ");

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[640px] overflow-hidden px-4 py-24 sm:px-6 sm:py-36">
        <Image
          src="/hero-lighthouse.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: HERO_OVERLAY }}
        />

        <div className="relative ml-auto max-w-xl text-right">
          <p className="text-base font-semibold uppercase tracking-[0.3em] text-amber-200/80 sm:text-lg">
            Full Gospel Christian Assembly
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl">
            The Message
            <br />
            of the Hour
          </h1>
          <p className="ml-auto mt-6 max-w-md text-base text-white/80 sm:text-lg">
            A community gathered around the Word of God, earnestly
            contending for the faith once delivered unto the saints.
          </p>
          <div className="mt-10 flex flex-col items-end justify-end gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="order-2 rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:order-1"
            >
              Join the Assembly
            </Link>
            <Link
              href="/the-message"
              className="order-1 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-black/20 transition hover:opacity-90 sm:order-2"
            >
              Listen to The Message
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          The Word of God
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <ScriptureQuote reference="Romans 10:17">
            So then faith cometh by hearing, and hearing by the word of God.
          </ScriptureQuote>
          <ScriptureQuote reference="Jude 1:3">
            &hellip;that ye should earnestly contend for the faith which was
            once delivered unto the saints.
          </ScriptureQuote>
        </div>
      </section>
    </div>
  );
}
