import { Product } from "../../_lib/interfaces";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../../_lib/helpers";
import { RefObject } from "react";

interface ProductCardProps {
  product: Product;
  ref?: RefObject<HTMLDivElement | null>;
}

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

export default function ProductCard({ product, ref }: ProductCardProps) {
  return (
    <div
      ref={ref}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
    >
      <div className="relative h-60 bg-gray-200">
        {product.imageUrl ? (
          <Image
            src={`${NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            ${formatPrice(product.price)}
          </span>
          <Link
            href={`/product/details/${product.sku}`}
            className={`px-4 py-2 rounded-md ${
              product.isAvailable
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 cursor-not-allowed text-gray-600"
            }`}
            aria-disabled={!product.isAvailable}
          >
            {product.isAvailable ? "View Details" : "Unavailable"}
          </Link>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
