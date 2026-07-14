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

  // Always re-check approval fresh from the database rather than trusting
  // the session token, since an admin may approve/revoke access at any
  // time after the session was issued.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, approved: true },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const isApproved = user.role === "ADMIN" || user.approved;

  if (!isApproved) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          The Message
        </h1>
        <p className="mt-4 rounded-md bg-muted px-4 py-3 text-sm text-foreground/80">
          Your account is awaiting approval before you can listen to sermons.
          A church admin needs to approve your account first — please check
          back soon.
        </p>
      </div>
    );
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

      {user.role === "ADMIN" && (
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
