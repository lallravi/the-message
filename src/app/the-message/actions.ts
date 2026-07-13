"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveAudioFile } from "@/lib/storage";

const ALLOWED_AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
  ".oga",
  ".flac",
  ".weba",
  ".opus",
]);

export type UploadEpisodeState = {
  error?: string;
  success?: boolean;
};

export async function uploadEpisodeAction(
  _prevState: UploadEpisodeState,
  formData: FormData
): Promise<UploadEpisodeState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "You are not authorized to upload episodes." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const dateValue = String(formData.get("date") ?? "");
  const audio = formData.get("audio");

  if (!title || !dateValue) {
    return { error: "Title and date are required." };
  }
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return { error: "Please provide a valid date." };
  }
  if (!(audio instanceof File) || audio.size === 0) {
    return { error: "Please choose an audio file to upload." };
  }
  const hasAudioMimeType = audio.type.startsWith("audio/");
  const hasAllowedExtension = ALLOWED_AUDIO_EXTENSIONS.has(
    path.extname(audio.name).toLowerCase()
  );
  if (!hasAudioMimeType && !hasAllowedExtension) {
    return { error: "The uploaded file must be an audio file." };
  }

  const audioUrl = await saveAudioFile(audio);

  await prisma.episode.create({
    data: {
      title,
      date,
      audioUrl,
      uploadedById: session.user.id,
    },
  });

  revalidatePath("/the-message");
  return { success: true };
}
