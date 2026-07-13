"use client";

import { useActionState } from "react";
import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState
  );

  if (state.success) {
    return (
      <p className="rounded-md bg-green-50 px-3 py-3 text-sm text-green-800">
        Account created! Check your email for a verification link before
        signing in.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
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
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <p className="mt-1 text-xs text-foreground/50">At least 8 characters.</p>
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
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
