"use client";

import { useActionState } from "react";
import { credentialsSignInAction, type SignInState } from "./actions";

const initialState: SignInState = {};

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(
    credentialsSignInAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
