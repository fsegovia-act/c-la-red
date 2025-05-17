"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "../../_lib/helpers";
import { Product } from "../../_lib/interfaces";
import { useRouter } from "next/navigation";

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

const FeaturedProductsBanner = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "/api/products?page=1&limit=4&featured=true&available=true"
      );
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError("Failed to load products");
      }
    } catch (error) {
      setError("Error connecting to the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Productos destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between"
            >
              <div className="h-48 flex items-center justify-center">
                {product.imageUrl ? (
                  <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    <img
                      src={`${NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`}
                      alt={product.name}
                      className="h-full"
                    />
                  </div>
                ) : (
                  <span className="text-gray-500">Sin imagen</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center mb-1">
                  {product.tags?.includes("new") && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                      Nuevo
                    </span>
                  )}
                  {product.tags?.includes("offer") && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">
                      Oferta
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-lg mb-1 text-gray-800">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-blue-700 mb-2">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Stock: {product.stockQuantity} und.
                  </span>
                  <button
                    onClick={() =>
                      router.push(`/product/details/${product.sku}`)
                    }
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300 hover:cursor-pointer"
                  >
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push(`/products`)}
            className="bg-blue-700 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-800 transition duration-300 hover:cursor-pointer"
          >
            Ver todos los productos
          </button>
        </div>
      </div>
    </section>
  );
};
export default FeaturedProductsBanner;
