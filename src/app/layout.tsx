import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SprintFlow - Turn your task list into focused sprints",
  description: "Paste your to-dos and SprintFlow's AI builds a Pomodoro plan, guides every focus session, and rewards the work you get done.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-600 bg-white">
        {children}
      </body>
    </html>
  );
}
