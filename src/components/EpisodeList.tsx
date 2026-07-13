import type { Episode } from "@/generated/prisma/client";

export default function EpisodeList({ episodes }: { episodes: Episode[] }) {
  if (episodes.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        No episodes have been posted yet. Check back soon.
      </p>
    );
  }

  return (
    <ul className="space-y-5">
      {episodes.map((episode) => (
        <li
          key={episode.id}
          className="rounded-lg border border-border bg-background p-4 sm:p-5"
        >
          <h3 className="font-serif text-lg font-semibold text-foreground">
            {episode.title}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-foreground/50">
            {new Date(episode.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <audio
            controls
            preload="none"
            src={episode.audioUrl}
            className="mt-3 w-full"
          >
            Your browser does not support the audio element.
          </audio>
        </li>
      ))}
    </ul>
  );
}
