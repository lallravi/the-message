"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export type ForgotPasswordState = {
  submitted?: boolean;
};

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (email) {
    const user = await prisma.user.findUnique({ where: { email } });

    // Only credentials accounts have a password to reset; Google-only
    // accounts don't have one. Either way, always show the same generic
    // confirmation so this form can't be used to discover which emails
    // have an account.
    if (user?.passwordHash) {
      const token = randomBytes(32).toString("hex");
      await prisma.passwordResetToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });

      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;
      await sendPasswordResetEmail(email, resetUrl);
    }
  }

  return { submitted: true };
}
