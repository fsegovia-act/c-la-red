"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../../_lib/interfaces";
import InfoProduct from "../../../../_components/product/Info";
import EditProduct from "../../../../_components/product/Edit";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typeAction, setTypeAction] = useState<string>("edit");

  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product Page (Private)</h1>
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
  );
}
