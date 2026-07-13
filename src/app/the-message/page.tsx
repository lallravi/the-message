import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import EpisodeList from "@/components/EpisodeList";
import UploadForm from "./UploadForm";

export default async function TheMessagePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const episodes = await prisma.episode.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        The Message
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Podcast episodes, newest first.
      </p>

      {session.user.role === "ADMIN" && (
        <div className="mt-8">
          <UploadForm />
        </div>
      )}

      <div className="mt-8">
        <EpisodeList episodes={episodes} />
      </div>
    </div>
  );
}
