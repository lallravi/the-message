export default function EagleLogo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eagle-badge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2c12" />
          <stop offset="100%" stopColor="#140f0c" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#eagle-badge)" />
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="#b8792f"
        strokeWidth="1.5"
      />

      {/* left wing, feathered tip */}
      <path
        fill="#ffffff"
        d="M44 46
           L8 20
           L16 26
           L5 34
           L14 39
           L6 48
           L16 51
           L12 60
           L23 57
           L26 64
           L42 60
           Z"
      />
      {/* right wing, mirrored */}
      <path
        fill="#ffffff"
        d="M56 46
           L92 20
           L84 26
           L95 34
           L86 39
           L94 48
           L84 51
           L88 60
           L77 57
           L74 64
           L58 60
           Z"
      />
      {/* tail */}
      <path fill="#ffffff" d="M42 78 L50 96 L58 78 L50 83 Z" />
      {/* torso */}
      <path fill="#ffffff" d="M44 38 L39 58 L38 79 L50 85 L62 79 L61 58 L56 38 Z" />
      {/* head, distinctly white and rounder like a bald eagle's */}
      <circle cx="50" cy="28" r="10" fill="#ffffff" />
      {/* eye */}
      <circle cx="53" cy="26" r="1.6" fill="#2b2420" />
      {/* hooked beak, the signature gold/yellow bald-eagle feature */}
      <path
        fill="#d9a441"
        d="M50 32
           C 54 32 57.5 33.5 59.5 36
           C 57 37 53.5 37.2 50.5 36.5
           C 49.5 38.5 48.5 40 47 41
           C 47.5 37.5 48.5 34.5 50 32
           Z"
      />
    </svg>
  );
}
