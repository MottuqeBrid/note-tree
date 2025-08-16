import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Note-Tree",
  description:
    "A note-taking application. where you can organize your thoughts in a tree structure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${raleway.variable} antialiased`}>{children}</body>
    </html>
  );
}
