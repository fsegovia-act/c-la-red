"use client";

import { useState, useEffect } from "react";
import { NextPage } from "next";
import { Product } from "../../../_lib/interfaces";
import ProductList from "../../../_components/product/list";
import CreateProduct from "../../../_components/product/create";

const CreateProductPage: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Product Page (Private)</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <CreateProduct
        fetchProducts={fetchProducts}
        setIsLoading={setIsLoading}
        setError={setError}
        isLoading={isLoading}
      />

      <ProductList products={products} isLoading={isLoading} type={"private"} />
    </div>
  );
};

export default CreateProductPage;
