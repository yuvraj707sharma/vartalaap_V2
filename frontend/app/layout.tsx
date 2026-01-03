import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Vartalaap AI 2.0 - Real-Time English Learning",
  description: "Revolutionary voice-based English learning platform with real-time interruptions and native language explanations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
