import Link from "next/link";
import ScriptureQuote from "@/components/ScriptureQuote";

const HERO_RAYS = `conic-gradient(from 0deg at 50% 120%,
  transparent 0deg, rgba(255,208,128,0.12) 4deg, transparent 8deg,
  transparent 22deg, rgba(255,208,128,0.12) 26deg, transparent 30deg,
  transparent 44deg, rgba(255,208,128,0.12) 48deg, transparent 52deg,
  transparent 66deg, rgba(255,208,128,0.12) 70deg, transparent 74deg,
  transparent 88deg, rgba(255,208,128,0.12) 92deg, transparent 96deg,
  transparent 110deg, rgba(255,208,128,0.12) 114deg, transparent 118deg,
  transparent 132deg, rgba(255,208,128,0.12) 136deg, transparent 140deg,
  transparent 154deg, rgba(255,208,128,0.12) 158deg, transparent 162deg,
  transparent 180deg)`;

const HERO_BACKGROUND = [
  HERO_RAYS,
  "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(184,121,47,0.35), transparent 70%)",
  "linear-gradient(180deg, #140f0c, #4a2c12)",
].join(", ");

export default function HomePage() {
  return (
    <div>
      <section
        className="relative overflow-hidden px-4 py-24 text-center sm:px-6 sm:py-36"
        style={{ backgroundImage: HERO_BACKGROUND }}
      >
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/70">
            Full Gospel Christian Assembly
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl">
            The Message
            <br />
            of the Hour
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/70 sm:text-lg">
            A community gathered around the Word of God, earnestly
            contending for the faith once delivered unto the saints.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/the-message"
              className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-black/20 transition hover:opacity-90"
            >
              Listen to The Message
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Join the Assembly
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
