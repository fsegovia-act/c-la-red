import type { Metadata } from "next";

type Props = {
  params: Promise<{ productCode: string }>;
};

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productCode } = await params;
  const productNotFound = {
    title: "Product not found",
    description: "No description",
    openGraph: {
      images: ["product-not-found.jpg"],
    },
  };

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
    description: product.description,
    openGraph: {
      images: [`${NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
