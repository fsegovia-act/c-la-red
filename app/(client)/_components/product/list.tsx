"use client";

import { useRouter } from "next/navigation";
import { Product } from "../../_lib/interfaces";
import { formatPrice } from "../../_lib/helpers";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
}: ProductListProps) => {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      {isLoading && products.length === 0 ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">
          No products found. Add your first product above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">SKU</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Stock</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Management</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-200">
                  <td
                    onClick={() => router.push(`/product/info/${product._id}`)}
                    className="py-2 px-4 border-b hover:cursor-pointer"
                  >
                    {product.name}
                  </td>
                  <td className="py-2 px-4 border-b">{product.sku}</td>
                  <td className="py-2 px-4 border-b">
                    ${formatPrice(product.price)}
                  </td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">
                    {product.stockQuantity}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isAvailable ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      onClick={() =>
                        router.push(`/product/info/${product._id}`)
                      }
                      className={`px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 hover:cursor-pointer hover:bg-green-300`}
                    >
                      {"Info"}
                    </span>
                    <span
                      onClick={() =>
                        router.push(`/product/edit/${product._id}`)
                      }
                      className={`px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:cursor-pointer hover:bg-blue-300`}
                    >
                      {"Edit"}
                    </span>
                    <span
                      onClick={() =>
                        router.push(`/product/delete/${product._id}`)
                      }
                      className={`px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 hover:cursor-pointer hover:bg-red-300`}
                    >
                      {"Delete"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
