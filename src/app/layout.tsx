import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const scriptureFont = Lora({
  variable: "--font-scripture",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Message of the Hour",
  description:
    "The Message — earnestly contending for the faith which was once delivered unto the saints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${scriptureFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
