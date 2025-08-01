"use client";

import {
  Dispatch,
  SetStateAction,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { ProductForm } from "../../_lib/interfaces";
import BackgroundRemover from "../removeBg/RemoveBg";
import imageCompression from 'browser-image-compression';

interface ProductFormProps {
  fetchProducts: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
}

const CreateProduct: React.FC<ProductFormProps> = ({
  fetchProducts,
  setIsLoading,
  setError,
  isLoading,
}: ProductFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    sku: "",
    category: "",
    stockQuantity: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const blobToFile = (blob) => {
    const fileName = blob?.name || "image-product-default.jpg";
    const file = new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
    return file;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) return;

    // optimize image
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const blobOptimizedFile = await imageCompression(file, options);
    const optimizedFile = blobToFile(blobOptimizedFile);
    setCompressedFile(optimizedFile);

    setIsLoading(true);
    setError(null);

    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
        file: optimizedFile
      };

      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });

      formData.append("file", file);

      const res: Response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Error ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        fetchProducts();
        setForm({
          name: "",
          description: "",
          price: "",
          sku: "",
          category: "",
          stockQuantity: "",
        });
        setFile(null);
        window.location.reload();
      } else {
        setError(data.error || "Failed to create product");
      }
    } catch (error) {
      console.log(error);
      setError(error.message ? error.message : error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
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
            <BackgroundRemover
              file={file}
              setFile={setFile}
            />
          </div>
        </div>

        <div>
          {file && (
            <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
           File name:{file.name} File size:{file.size} File type:{file.type}
          </label>
          )}
          {compressedFile && (
            <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
           Compressed File name:{compressedFile.name} File size:{compressedFile.size} File type:{compressedFile.type}
          </label>
          )}
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
            {isLoading ? "Saving..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateProduct;
