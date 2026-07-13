"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type ResetPasswordState = {
  error?: string;
  success?: boolean;
};

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "Missing or invalid reset link." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    if (resetToken) {
      await prisma.passwordResetToken.delete({ where: { token } });
    }
    return {
      error: "That reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: resetToken.identifier },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return { success: true };
}
