"use client";

import { useActionState, useRef } from "react";
import { uploadEpisodeAction, type UploadEpisodeState } from "./actions";

const initialState: UploadEpisodeState = {};

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    async (prevState: UploadEpisodeState, formData: FormData) => {
      const result = await uploadEpisodeAction(prevState, formData);
      if (result.success) {
        formRef.current?.reset();
      }
      return result;
    },
    initialState
  );

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-6">
      <h2 className="font-serif text-lg font-semibold text-foreground">
        Upload a new episode
      </h2>
      <form ref={formRef} action={formAction} className="mt-4 space-y-4">
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
            accept="audio/*"
            required
            className="mt-1 w-full text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent-foreground"
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        )}
        {state.success && (
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
