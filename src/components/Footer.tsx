import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-foreground/70 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Image src="/eagle-logo.png" alt="" width={40} height={40} />
          <p className="font-display text-lg font-bold text-foreground">
            Full Gospel Christian Assembly
          </p>
        </div>
        <p className="mt-4 text-xs text-foreground/50">
          &copy; {new Date().getFullYear()} Themessage.app. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
