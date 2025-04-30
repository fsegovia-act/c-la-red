import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C La Red",
  description: "Tienda online - eléctronica, hogar, accesorios y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
