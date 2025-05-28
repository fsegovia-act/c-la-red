"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../../_lib/interfaces";
import InfoProduct from "../../../../_components/product/info";
import { PRIVATE } from "../../../../_lib/constant";
import MainNavigationBar from "../../../../_components/navigation/mainNavigationBar";
import { useRequireAuth } from "../../../../hooks/useRequireAuth";
import Loader from "../../../../_components/loader/Loader";
import ErrorComponent from "../../../../_components/error/Error";
import ProductNotFound from "../../../../_components/product/notFound";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useRequireAuth();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
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

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) return <Loader />;

  if (error) return <ErrorComponent error={error} />;

  if (!product) return <ProductNotFound />;

  return (
    <>
      <MainNavigationBar type={PRIVATE} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">
            Info Product Page (Private)
          </h1>

          <button
            onClick={() => router.push(`/product/edit/${product._id}`)}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300 hover:cursor-pointer max-h-[40px] hover:cursor-pointer"
          >
            Edit Product
          </button>
        </div>

        <InfoProduct product={product} />
      </div>
    </>
  );
}
