import Link from "next/link";
import SignInForm from "./SignInForm";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { googleSignInAction } from "@/lib/auth-actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Sign in to listen to The Message podcast episodes.
      </p>

      {params.verified === "1" && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          Your email has been verified. You can now sign in.
        </p>
      )}
      {params.error === "invalid_token" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          That verification link is invalid or has expired.
        </p>
      )}

      <div className="mt-8 space-y-6">
        <GoogleAuthButton action={googleSignInAction} label="Sign in with Google" />

        <div className="flex items-center gap-3 text-xs uppercase text-foreground/40">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <SignInForm />
      </div>

      <p className="mt-6 text-sm text-foreground/70">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
