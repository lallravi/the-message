import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        Reset your password
      </h1>

      {token ? (
        <div className="mt-8">
          <ResetPasswordForm token={token} />
        </div>
      ) : (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          This reset link is missing its token. Please request a new one from
          the sign-in page.
        </p>
      )}
    </div>
  );
}
