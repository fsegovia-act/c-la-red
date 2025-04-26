"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "../../../../_lib/interfaces";
import InfoProduct from "../../../../_components/product/info";
import AdminNavigationBar from "../../../../_components/navigation/adminNavigationBar";

export default function DeleteProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleSubmit = async (productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setIsLoading(false);
        router.push("/products/management");
      } else {
        setError(data.error || "Failed to update product");
      }
    } catch (error) {
      setError("Error submitting the form");
    } finally {
      setIsLoading(false);
    }
  };

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
    <>
      <AdminNavigationBar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">
            Delete Product Page (Private)
          </h1>

          <button
            onClick={() => handleSubmit(productId)}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition duration-300 hover:cursor-pointer max-h-[40px] hover:cursor-pointer"
          >
            Delete Product
          </button>
        </div>
        <InfoProduct product={product} />
      </div>
    </>
  );
}
