import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jo Suburi Flash Cards",
  description: "Drill the 20 aikido jo suburi techniques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
        <footer className="border-t border-border/60 px-4 py-6 sm:py-8">
          <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            Getting value from the quizzes?{" "}
            <a
              href="https://www.aikidoinfredericksburg.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Aikido in Fredericksburg
            </a>{" "}
            is a 501(c)(3) non-profit with an educational mission to teach
            and practice the non-violent traditional Japanese martial art of
            Aikido in central Virginia.{" "}
            <a
              href="https://www.aikidoinfredericksburg.org/donate/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Consider donating today!
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
