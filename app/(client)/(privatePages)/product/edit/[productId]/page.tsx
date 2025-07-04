"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../../_lib/interfaces";
import InfoProduct from "../../../../_components/product/info";
import EditProduct from "../../../../_components/product/edit";
import MainNavigationBar from "../../../../_components/navigation/mainNavigationBar";
import { PRIVATE } from "../../../../_lib/constant";
import { useRequireAuth } from "../../../../hooks/useRequireAuth";
import Loader from "../../../../_components/loader/Loader";
import ErrorComponent from "../../../../_components/error/Error";
import ProductNotFound from "../../../../_components/product/notFound";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typeAction, setTypeAction] = useState<string>("edit");

  const [error, setError] = useState<string | null>(null);

  useRequireAuth();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  async function fetchProduct() {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loader />;

  if (error) return <ErrorComponent error={error} />;

  if (!product) return <ProductNotFound />;

  return (
    <>
      <MainNavigationBar type={PRIVATE} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">
            Edit Product Page (Private)
          </h1>

          <button
            onClick={() => router.push(`/product/info/${product._id}`)}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300 hover:cursor-pointer max-h-[40px] hover:cursor-pointer"
          >
            Details
          </button>
        </div>
        {typeAction === "edit" && (
          <EditProduct
            product={product}
            fetchProduct={fetchProduct}
            setIsLoading={setIsLoading}
            setError={setError}
            isLoading={isLoading}
            setTypeAction={setTypeAction}
          />
        )}
        {typeAction === "info" && <InfoProduct product={product} />}
      </div>
    </>
  );
}
