import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LoadingScreenProvider } from "@/components/LoadingScreenProvider";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CityVibe - Discover Your City",
  description: "Hyperlocal discovery platform for Tier 2 and Tier 3 Indian cities",
  icons: {
    icon: "/CityVibe.png",
    shortcut: "/CityVibe.png",
    apple: "/CityVibe.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LoadingScreenProvider>{children}</LoadingScreenProvider>
      </body>
    </html>
  );
}
