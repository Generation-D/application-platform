import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Apl_Header from "@/components/layout/header";
import Apl_Footer from "@/components/layout/footer";
import { ReduxProvider } from "@/store/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generation-D Bewerbung",
  description: "Bewirb dich beim Social Startup Wettbewerb Generation-D.",
  icons: [
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <ReduxProvider>
          <main className="min-h-screen w-full">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
