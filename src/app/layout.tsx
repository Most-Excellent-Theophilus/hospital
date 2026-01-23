import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@/lib/interceptor"
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

import type { Viewport } from 'next'
import { DismissToastOnRouteChange } from "@/components/dismis-toast";


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,

}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Hearts 4 a mission",
  description: "Hearts 4 a mission",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} animate-in fade-in duration-300  antialiased flex  min-h-screen items-center justify-center`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <DismissToastOnRouteChange />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
