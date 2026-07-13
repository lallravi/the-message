import type { NextAuthConfig } from "next-auth";

// Edge-safe subset of the Auth.js config: no Prisma adapter, no bcrypt.
// This is the only part bundled into middleware (which runs on the Edge
// runtime); the full config with the database adapter lives in `auth.ts`
// and is only ever loaded by Node.js route handlers.
export default {
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      if (path.startsWith("/admin")) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/sign-in", request.nextUrl));
        }
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/", request.nextUrl));
        }
        return true;
      }

      if (path.startsWith("/the-message")) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/sign-in", request.nextUrl));
        }
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
