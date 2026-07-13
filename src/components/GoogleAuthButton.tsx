export default function GoogleAuthButton({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.43 3.58v2.98h3.93c2.3-2.12 3.52-5.24 3.52-8.8z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.93-2.98c-1.09.73-2.49 1.16-4 1.16-3.08 0-5.68-2.08-6.61-4.87H1.34v3.07C3.31 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.39 14.38A7.19 7.19 0 015 12c0-.83.14-1.63.39-2.38V6.55H1.34A11.98 11.98 0 000 12c0 1.93.46 3.76 1.34 5.45l4.05-3.07z"
          />
          <path
            fill="#EA4335"
            d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.45-3.45C17.94 1.19 15.24 0 12 0 7.31 0 3.31 2.7 1.34 6.55l4.05 3.07C6.32 6.85 8.92 4.77 12 4.77z"
          />
        </svg>
        {label}
      </button>
    </form>
  );
}
