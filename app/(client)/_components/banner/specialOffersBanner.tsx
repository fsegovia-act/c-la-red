"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "../../_lib/helpers";
import { Product } from "../../_lib/interfaces";
import { useRouter } from "next/navigation";

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

const SpecialOffersBanner = () => {
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
      const res = await fetch("/api/products?page=3&limit=2&featured=true");
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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Ofertas especiales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((offer) => (
            <div
              key={offer._id}
              className="flex flex-col md:flex-row bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 md:h-auto md:w-1/3 bg-white flex items-center justify-center">
                <img
                  src={`${NEXT_PUBLIC_S3_BASE_URL}${offer.imageUrl}`}
                  alt={offer.name}
                  className="w-auto h-full md:w-full md:h-auto"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium">
                    Oferta limitada
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">
                  {offer.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {offer.description}
                </p>
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-blue-700 mr-3">
                    {formatPrice(offer.price)}
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    {formatPrice(offer.price * 1.25)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600 font-medium">
                    ¡Solo quedan {offer.stockQuantity} disponibles!
                  </span>
                  <button
                    onClick={() => router.push(`/product/details/${offer.sku}`)}
                    className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition duration-300 hover:cursor-pointer"
                  >
                    Ver ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default SpecialOffersBanner;
