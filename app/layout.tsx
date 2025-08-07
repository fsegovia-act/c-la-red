import type { Metadata } from "next";
import "./globals.css";
import GoogleTagManager from "./(client)/_components/gtm/GoogleTagManager";
import ClientProvider from "./components/ClientProvider";
import { BUSINESS_NAME } from "./(client)/_lib/constant";

export const metadata: Metadata = {
  title: BUSINESS_NAME,
  description: "Tienda online - eléctronica, hogar, accesorios y más.",
  keywords: ["tienda online", "electrónica", "hogar", "accesorios"],
  authors: [{ name: BUSINESS_NAME }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: BUSINESS_NAME,
    description: "Tienda online - eléctronica, hogar, accesorios y más.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXX";
  return (
    <html lang="es">
      <head>
        <GoogleTagManager gtmId={GTM_ID} />
      </head>
      <body>
        <ClientProvider gtmId={GTM_ID}>{children}</ClientProvider>
      </body>
    </html>
  );
}
