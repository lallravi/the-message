"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error:
        "An account with this email already exists. Try signing in instead.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const adminEmail = process.env.ADMIN_EMAIL;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      provider: "CREDENTIALS",
      role: adminEmail && email === adminEmail ? "ADMIN" : "USER",
    },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: user.email,
      token,
      expires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
  await sendVerificationEmail(user.email, verifyUrl);

  return { success: true };
}
