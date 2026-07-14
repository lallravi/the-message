import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";

class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Google has already verified this email address for us.
          emailVerified: profile.email_verified ? new Date() : null,
          role: "USER" as const,
          provider: "GOOGLE" as const,
        };
      },
    }),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError();
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      // First-time provisioning of the site admin: whichever sign-up method
      // (Google or email/password) first registers this address becomes admin.
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail && user.email === adminEmail) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN", provider: "GOOGLE", approved: true },
        });
      }
    },
    async signIn({ user }) {
      if (!user.id) return;

      let ipAddress: string | null = null;
      let userAgent: string | null = null;
      try {
        const hdrs = await headers();
        userAgent = hdrs.get("user-agent");
        ipAddress =
          hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          hdrs.get("x-real-ip") ??
          null;
      } catch {
        // headers() is unavailable outside a request context — ignore.
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }),
        prisma.loginEvent.create({
          data: { userId: user.id, ipAddress, userAgent },
        }),
      ]);
    },
  },
});
