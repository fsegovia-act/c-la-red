import type { Metadata } from "next";

type Props = {
  params: Promise<{ productCode: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productCode } = await params;
  const productNotFound = {
    title: "Product not found",
    openGraph: {
      images: ["product-not-found.jpg"],
    },
  };

  const NEXT_PUBLIC_API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/api/product/${productCode}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) return productNotFound;

  const data = await response.json();

  if (!data.success) return productNotFound;

  const product = data.data;

  return {
    title: product.name,
    openGraph: {
      images: [product.imageUrl],
    },
  };
}

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
