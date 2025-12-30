import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

import type { Viewport } from 'next'


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Hospital system",
  description: "Heart Rate",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const patients = await generatePatientsWithMeta(500)
  // console.log({ patients })

  // const bulkWriter = db.bulkWriter();

  // patients.forEach((patient) => {
  //   const ref = db.collection("patients").doc(patient.id);

  //   bulkWriter.create(ref, {
  //     ...patient,

  //   });
  // });

  // await bulkWriter.close();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} animate-in fade-in duration-300  antialiased flex  min-h-screen items-center justify-center`}
        suppressHydrationWarning
      >
        <Providers>
          {children} <Toaster />
        </Providers>
      </body>
    </html>
  );
}
