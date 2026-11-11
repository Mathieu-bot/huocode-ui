import type { Metadata } from "next";
import { Hanken_Grotesk, Red_Hat_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const redHatMono = Red_Hat_Mono({
  variable: "--font-red-hat-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: "HuoCode",
  description: "Map where the risk sits in a codebase.",
  icons: { icon: "/logo/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${redHatMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
