import "../globals.css";
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
    <div className="flex flex-col min-h-screen w-full">
      <Apl_Header />
      <div className="flex-grow">
        <div className="flex flex-col rounded items-center p-0 justify-center m-0 mx-auto max-w-full bg-white">
          {children}
        </div>
      </div>
      <Apl_Footer />
    </div>
  );
}
