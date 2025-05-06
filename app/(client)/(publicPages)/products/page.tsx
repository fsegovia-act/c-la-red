"use client";

import { useState, useEffect, Suspense } from "react";
import { NextPage } from "next";
import { Product } from "../../_lib/interfaces";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";
import MainFooter from "../../_components/footer/mainFooter";
import { useSearchParams } from "next/navigation";
import Loader from "../../_components/loader/Loader";
import { PUBLIC } from "../../_lib/constant";
import InfiniteScrollProducts from "../../_components/product/infiniteScrollProducts";

const Products: NextPage = () => {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);

  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInitialProducts();
  }, [search]);

  const getProducts = async (page = 1): Promise<Product[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const res = search
        ? await fetch(
            `/api/products?search=${search}&available=true&page=${page}&limit=16`
          )
        : await fetch(`/api/products?available=true&page=${page}&limit=16`);

      const data = await res.json();

      if (!data.success) setError("Failed to load products");
      if (page === 1) setInitialProducts(data.data);

      return data.data;
    } catch (error) {
      setError("Error connecting to the server");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getInitialProducts = async (): Promise<Product[]> =>
    await getProducts();

  const fetchMoreProducts = async (page: number): Promise<Product[]> =>
    await getProducts(page);

  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <MainNavigationBar type={PUBLIC} />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {initialProducts.length ? (
            <InfiniteScrollProducts
              initialProducts={initialProducts}
              fetchMoreProducts={fetchMoreProducts}
            />
          ) : (
            <div>Product not found</div>
          )}
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
