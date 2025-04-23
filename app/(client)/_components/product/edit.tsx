"use client";

import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { Product, EditProductForm } from "../../_lib/interfaces";

interface ProductFormProps {
  fetchProduct: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
  product: Product;
  setTypeAction: Dispatch<SetStateAction<string>>
}

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

const EditProduct: React.FC<ProductFormProps> = ({
  fetchProduct,
  setIsLoading,
  setError,
  isLoading,
  product,
  setTypeAction,
}: ProductFormProps) => {
  const [form, setForm] = useState<EditProductForm>({
    _id: product._id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    sku: product.sku,
    category: product.category,
    stockQuantity: product.stockQuantity.toString(),
    imageUrl: product.imageUrl,
  });
  const [file, setFile] = useState<File | null>(null);
  const [urlFile, setUrlFile] = useState<string>(
    `${NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setUrlFile(url);
      setFile(files[0]);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
        file: file,
      };

      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });

      formData.append("file", file);

      const res = await fetch(`/api/products/${form._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        fetchProduct();
        setForm({
          _id: "",
          name: "",
          description: "",
          price: "",
          sku: "",
          category: "",
          stockQuantity: "",
          imageUrl: "",
        });
        setTypeAction("info");
      } else {
        setError(data.error || "Failed to update product");
      }
    } catch (error) {
      setError("Error submitting the form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Product name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                SKU *
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                required
                placeholder="Stock keeping unit"
                value={form.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <input
                id="category"
                name="category"
                type="text"
                required
                placeholder="Product category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="stockQuantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock Quantity *
              </label>
              <input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                required
                placeholder="Quantity in stock"
                value={form.stockQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <div>
              <label
                htmlFor="Image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image
              </label>

              <div className="relative h-96 w-full rounded-lg overflow-hidden">
                <Image
                  src={urlFile}
                  alt={file ? file.name : "image-product-default"}
                  fill
                  className="object-cover"
                />
              </div>

              <input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            placeholder="Product description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Edit Product"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditProduct;
