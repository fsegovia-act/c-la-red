"use client";

import { useState, useEffect, Suspense } from "react";
import { NextPage } from "next";
import { Product } from "../../_lib/interfaces";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";
import MainFooter from "../../_components/footer/mainFooter";
import { useSearchParams } from "next/navigation";
import { PUBLIC } from "../../_lib/constant";
import InfiniteScrollProducts from "../../_components/product/infiniteScrollProducts";
import Loader from "../../_components/loader/Loader";
import ErrorComponent from "../../_components/error/Error";
import ProductNotFound from "../../_components/product/notFound";

const Products: NextPage = () => {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);

  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getInitialProducts();
  }, [search]);

  const getProducts = async (page = 1): Promise<Product[]> => {
    try {
      if (page === 1) setIsLoading(true);
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
      if (page === 1) setIsLoading(false);
    }
  };

  const getInitialProducts = async (): Promise<Product[]> =>
    await getProducts();

  const fetchMoreProducts = async (page: number): Promise<Product[]> =>
    await getProducts(page);

  if (error) return <ErrorComponent error={error} />;

  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <MainNavigationBar type={PUBLIC} />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>

          {isLoading && <Loader />}

          {!isLoading && initialProducts.length > 0 && (
            <InfiniteScrollProducts
              initialProducts={initialProducts}
              fetchMoreProducts={fetchMoreProducts}
            />
          )}

          {!isLoading && initialProducts.length === 0 && <ProductNotFound />}
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
