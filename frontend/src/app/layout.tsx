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
      <body className={`${inter.className} bg-primary`}>
        <ReduxProvider>
          <div className="flex flex-col min-h-screen w-full">
            <Apl_Header />
            <div className="flex-grow">
              <main className="flex flex-col rounded items-center p-8 justify-center space-y-6 mx-auto max-w-full bg-white">
            {children}
              </main>
            </div>
            <Apl_Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
