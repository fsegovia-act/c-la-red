"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../../_lib/interfaces";
import InfoProduct from "../../../../_components/product/info";
import MainNavigationBar from "../../../../_components/navigation/mainNavigationBar";
import MainFooter from "../../../../_components/footer/mainFooter";
import AdditionalInformationBanner from "../../../../_components/banner/additionalInformationBanner";
import { PUBLIC } from "../../../../_lib/constant";
import Loader from "../../../../_components/loader/Loader";
import ErrorComponent from "../../../../_components/error/Error";
import ProductNotFound from "../../../../_components/product/notFound";

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

  if (loading) return <Loader />;

  if (error) return <ErrorComponent error={error} />;

  if (!product) return <ProductNotFound />;

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <MainNavigationBar type={PUBLIC} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Product Details
        </h1>
        <InfoProduct product={product} />
      </div>

      <AdditionalInformationBanner />

      <MainFooter />
    </div>
  );
}
