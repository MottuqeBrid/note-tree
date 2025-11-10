import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // or whatever weights you need
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
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
