"use client";

import { formatPrice } from "../../_lib/helpers";
import { Product } from "../../_lib/interfaces";
import { useRouter } from "next/navigation";

const FEATURED_PRODUCTS: Product[] = [
  {
    _id: "1",
    name: "Producto Premium 1",
    description: "Este es un producto destacado de alta calidad",
    price: 999.99,
    sku: "SKU001",
    category: "Electrónicos",
    stockQuantity: 10,
    isAvailable: true,
    imageUrl: "/images/product-1.jpg",
    tags: ["premium", "nuevo", "destacado"],
  },
  {
    _id: "2",
    name: "Producto Más Vendido",
    description: "Nuestro producto más popular del mes",
    price: 499.5,
    sku: "SKU002",
    category: "Hogar",
    stockQuantity: 25,
    isAvailable: true,
    imageUrl: "/images/product-2.jpg",
    tags: ["bestseller", "oferta"],
  },
  {
    _id: "3",
    name: "Novedad Temporada",
    description: "La última novedad en nuestro catálogo",
    price: 1299.99,
    sku: "SKU003",
    category: "Tecnología",
    stockQuantity: 5,
    isAvailable: true,
    imageUrl: "/images/product-3.jpg",
    tags: ["nuevo", "limitado"],
  },
  {
    _id: "4",
    name: "Oferta Especial",
    description: "Aprovecha esta oferta por tiempo limitado",
    price: 299.99,
    sku: "SKU004",
    category: "Accesorios",
    stockQuantity: 50,
    isAvailable: true,
    imageUrl: "/images/product-4.jpg",
    tags: ["oferta", "descuento"],
  },
];

const FeaturedProductsBanner = () => {
  const router = useRouter();

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Productos destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.imageUrl ? (
                  <div className="relative w-full h-full">
                    <span className="text-gray-500">Imagen del producto</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Sin imagen</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center mb-1">
                  {product.tags?.includes("nuevo") && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                      Nuevo
                    </span>
                  )}
                  {product.tags?.includes("oferta") && (
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
                  <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300">
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
