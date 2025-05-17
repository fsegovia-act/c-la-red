"use client";

import type { Metadata } from "next";
import "./globals.css";
import GoogleTagManager from "./(client)/_components/gtm/GoogleTagManager";
import GoogleTagManagerNoScript from "./(client)/_components/gtm/GoogleTagManagerNoScript";
import { AppProvider } from "./(client)/context/AppContext";

const metadata: Metadata = {
  title: "C La Red",
  description: "Tienda online - eléctronica, hogar, accesorios y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXX";
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId={GTM_ID} />
      </head>
      <body>
        <GoogleTagManagerNoScript gtmId={GTM_ID} />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
