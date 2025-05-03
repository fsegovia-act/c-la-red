import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products Page",
  description: "Our product catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
