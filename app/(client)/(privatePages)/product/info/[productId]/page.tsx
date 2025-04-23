"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrl?: string;
  tags?: string[];
}

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Info Product Page (Private)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="product-image">
          {product.imageUrl ? (
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={`${NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>

        <div className="product-details">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="text-xl font-semibold text-blue-600 mb-4">
            ${product.price.toFixed(2)}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">SKU</p>
              <p className="font-medium">{product.sku}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Availability</p>
              <p className="font-medium">
                {product.isAvailable ? (
                  <span className="text-green-600">
                    In Stock ({product.stockQuantity})
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              product.isAvailable
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!product.isAvailable}
          >
            {product.isAvailable ? "Contact" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
