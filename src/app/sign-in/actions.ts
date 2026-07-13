"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type SignInState = {
  error?: string;
};

export async function credentialsSignInAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/the-message",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      const code = (error as AuthError & { code?: string }).code;
      if (code === "email_not_verified") {
        return {
          error: "Please verify your email before signing in — check your inbox for the verification link.",
        };
      }
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}
