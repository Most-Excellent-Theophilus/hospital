import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

import type { Viewport } from 'next'
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { capitalizeFirstLetter } from "@/lib/utils";
import { linksIconMap } from "@/components/app-sidebar/config";
import { Home } from "lucide-react";

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
  title: "Hearts 4 a mission",
  description: "Hearts 4 a mission",
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
  // generatePaths()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} animate-in fade-in duration-300  antialiased flex  min-h-screen items-center justify-center`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
// function generatePaths() {
//   Object.entries(linksIconMap).concat([['account', {icon:Home, name:'account', url:'accou'}]]).forEach(async ([name, data]) => {
//     const filePath = `${name}/index.tsx`


//     await createModule(filePath, capitalizeFirstLetter(name.replace('-', '_')));
//     ['create', 'update', 'view', 'delete'].forEach(async (val) => {
//       await createModule(`${name}/${val}/index.tsx`, capitalizeFirstLetter(`${name.replace('-', '_')}${val}`));

//     })

//   });
// }
// const createModule = async (relativeFilePath: string, pascal: string) => {
//   // relativeFilePath example:
//   // inventory/index.tsx
//   // inventory/products/index.tsx

//   const fullPath = path.join(
//     process.cwd(),
//     "src/features/pages",
//     relativeFilePath
//   );

//   const dir = path.dirname(fullPath);      // ✅ folder
//   const file = fullPath;                   // ✅ file

//   await mkdir(dir, { recursive: true });

//   const fileName = path.basename(file, ".tsx");


//   const content = `
// const ${pascal}Module = () => {
//   return <div>${pascal} Module</div>;
// };

// export default ${pascal}Module;
// `;

//   await writeFile(file, content.trim(), "utf8");
// };