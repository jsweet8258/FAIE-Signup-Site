import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FAIE Workshop - Transform Research into Industry Impact | Oregon State University",
  description: "Join the FAIE Workshop at Oregon State University. Learn how AI-powered Industry Engagement Plans can connect your research with industry partners. Register now for upcoming sessions.",
  keywords: ["FAIE", "Industry Engagement", "Oregon State University", "Faculty Workshop", "Research Commercialization", "Industry Partnerships", "Technology Transfer"],
  authors: [{ name: "Oregon State University Research Office" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
  },
  openGraph: {
    title: "FAIE Workshop - Transform Research into Industry Impact",
    description: "AI-powered Industry Engagement Plans for OSU Faculty",
    url: "https://research.oregonstate.edu/faie-workshop",
    siteName: "FAIE Workshop | Oregon State University",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAIE Workshop - Oregon State University",
    description: "Transform your research into industry partnerships with FAIE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased bg-white text-slate-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
