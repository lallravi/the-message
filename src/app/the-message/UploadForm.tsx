"use client";

import { useRef, useState, type FormEvent } from "react";
import { upload } from "@vercel/blob/client";
import { createEpisodeAction } from "./actions";

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

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const date = String(formData.get("date") ?? "");
    const fileInput = form.elements.namedItem("audio") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!title || !date) {
      setError("Title and date are required.");
      return;
    }
    if (!file) {
      setError("Please choose an audio file to upload.");
      return;
    }
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_AUDIO_EXTENSIONS.has(ext)) {
      setError(
        "Please choose a valid audio file (mp3, wav, m4a, aac, ogg, flac, etc)."
      );
      return;
    }

    setPending(true);
    try {
      // Uploads straight from the browser to Blob storage, bypassing the
      // server entirely for the file bytes — needed because serverless
      // functions cap request bodies well below the size of a typical
      // sermon recording.
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/episodes/upload-token",
        multipart: true,
      });

      const result = await createEpisodeAction(title, date, blob.url);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-6">
      <h2 className="font-serif text-lg font-semibold text-foreground">
        Upload a new episode
      </h2>
      <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-foreground">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="audio" className="block text-sm font-medium text-foreground">
            Audio file
          </label>
          <input
            id="audio"
            name="audio"
            type="file"
            accept="audio/*,.m4a,.mp3,.wav,.aac,.ogg,.flac"
            required
            className="mt-1 w-full text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent-foreground"
          />
        </div>

        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-800" role="status">
            Episode uploaded.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload episode"}
        </button>
      </form>
    </div>
  );
}
