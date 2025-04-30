"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../../_lib/interfaces";
import InfoProduct from "../../../../_components/product/info";
import MainNavigationBar from "../../../../_components/navigation/mainNavigationBar";
import MainFooter from "../../../../_components/footer/mainFooter";
import AdditionalInformationBanner from "../../../../_components/banner/additionalInformationBanner";
import { PUBLIC } from "../../../../_lib/constant";

export default function ProductDetailsByCodePage() {
  const params = useParams();
  const router = useRouter();
  const productCode = params.productCode as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${productCode}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
        } else {
          router.push("/not-found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    if (productCode) {
      fetchProduct();
    }
  }, [productCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <MainNavigationBar type={PUBLIC} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Product Details Page (public)
        </h1>
        <InfoProduct product={product} />
      </div>

      <AdditionalInformationBanner />

      <MainFooter />
    </div>
  );
}
