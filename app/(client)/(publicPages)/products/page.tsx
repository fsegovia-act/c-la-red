"use client";

import { useState, useEffect, Suspense } from "react";
import { NextPage } from "next";
import { Product } from "../../_lib/interfaces";
import ProductGrid from "../../_components/product/productGrid";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";
import MainFooter from "../../_components/footer/mainFooter";
import { useSearchParams } from "next/navigation";
import Loader from "../../_components/loader/Loader";

const Products: NextPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = search
        ? await fetch(`/api/products?search=${search}`)
        : await fetch("/api/products");
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
      <div className="flex flex-col justify-between min-h-screen">
        <MainNavigationBar />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            Product Catalog Page (public)
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <ProductGrid products={products} />
        </div>

        <MainFooter />
      </div>
    </>
  );
};

const ProductsPage: NextPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Products />
    </Suspense>
  );
};

export default ProductsPage;
