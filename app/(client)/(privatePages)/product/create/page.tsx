"use client";

import { useState, useEffect } from "react";
import { NextPage } from "next";
import { Product } from "../../../_lib/interfaces";
import ProductList from "../../../_components/product/list";
import CreateProduct from "../../../_components/product/create";
import MainNavigationBar from "../../../_components/navigation/mainNavigationBar";
import { PRIVATE } from "../../../_lib/constant";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import ErrorComponent from "../../../_components/error/Error";

const CreateProductPage: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useRequireAuth();

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
    <>
      <MainNavigationBar type={PRIVATE} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Create Product Page (Private)
        </h1>
        
        {error && <ErrorComponent error={error} />}

        <CreateProduct
          fetchProducts={fetchProducts}
          setIsLoading={setIsLoading}
          setError={setError}
          isLoading={isLoading}
        />

        <ProductList products={products} isLoading={isLoading} />
      </div>
    </>
  );
};

export default CreateProductPage;
