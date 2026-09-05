import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Precificação 3D",
  description: "Sistema de cálculo de preço para peças impressas em 3D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} font-sans flex min-h-screen flex-col`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
