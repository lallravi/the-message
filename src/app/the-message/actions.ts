"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type CreateEpisodeState = {
  error?: string;
  success?: boolean;
};

export async function createEpisodeAction(
  title: string,
  dateValue: string,
  audioUrl: string,
  seriesName: string
): Promise<CreateEpisodeState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "You are not authorized to upload episodes." };
  }

  const trimmedTitle = title.trim();
  if (!trimmedTitle || !dateValue || !audioUrl) {
    return { error: "Title, date, and audio file are all required." };
  }
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return { error: "Please provide a valid date." };
  }

  const trimmedSeries = seriesName.trim();
  let seriesId: string | undefined;
  if (trimmedSeries) {
    const series = await prisma.series.upsert({
      where: { name: trimmedSeries },
      update: {},
      create: { name: trimmedSeries },
    });
    seriesId = series.id;
  }

  await prisma.episode.create({
    data: {
      title: trimmedTitle,
      date,
      audioUrl,
      uploadedById: session.user.id,
      seriesId,
    },
  });

  revalidatePath("/the-message");
  return { success: true };
}
