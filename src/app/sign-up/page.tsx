import Link from "next/link";
import SignUpForm from "./SignUpForm";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { googleSignInAction } from "@/lib/auth-actions";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        Create an account
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Sign up to listen to The Message podcast episodes.
      </p>

      <div className="mt-8 space-y-6">
        <GoogleAuthButton action={googleSignInAction} label="Sign up with Google" />

        <div className="flex items-center gap-3 text-xs uppercase text-foreground/40">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <SignUpForm />
      </div>

      <p className="mt-6 text-sm text-foreground/70">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
