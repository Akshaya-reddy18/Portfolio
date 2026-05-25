import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akshaya Kondamwar | AI Digital Twin",
  description: "This is not a portfolio. This is my AI-powered digital twin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground min-h-screen selection:bg-primary selection:text-white`}>
        {/* We can add a global noise overlay for cyber aesthetic here if desired */}
        <div className="fixed inset-0 pointer-events-none z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background"></div>
        {children}
      </body>
    </html>
  );
}
