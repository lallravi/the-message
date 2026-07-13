import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function formatDateTime(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [users, loginEvents] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.loginEvent.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
      include: { user: { select: { email: true, name: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        Users
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        All registered users and their sign-up / login activity.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">Name</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">Email</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">Sign-up method</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">Verified</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">Signed up</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">Last login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap px-4 py-3">
                  {user.name ?? "—"}
                  {user.role === "ADMIN" && (
                    <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      Admin
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{user.email}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {user.provider === "GOOGLE" ? "Google" : "Email / password"}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {user.emailVerified ? "Yes" : "No"}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatDateTime(user.createdAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatDateTime(user.lastLoginAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 font-serif text-2xl font-bold text-foreground">
        Login history
      </h2>
      <p className="mt-2 text-sm text-foreground/70">
        Full login history across all users (most recent 100).
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">User</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">Timestamp</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">IP address</th>
              <th className="px-4 py-3 text-left font-medium text-foreground/70">Device / user agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loginEvents.map((event) => (
              <tr key={event.id}>
                <td className="whitespace-nowrap px-4 py-3">
                  {event.user.name ?? event.user.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatDateTime(event.timestamp)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {event.ipAddress ?? "—"}
                </td>
                <td className="max-w-xs truncate px-4 py-3" title={event.userAgent ?? undefined}>
                  {event.userAgent ?? "—"}
                </td>
              </tr>
            ))}
            {loginEvents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-foreground/50">
                  No logins recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
