"use client";

import { NextPage } from "next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MainNavigationBar from "../../../_components/navigation/mainNavigationBar";
import MainFooter from "../../../_components/footer/mainFooter";
import { BUSINESS_PHONE_NUMBER, PUBLIC } from "../../../_lib/constant";
import { Product } from "../../../_lib/interfaces";
import InfiniteScrollProducts from "../../../_components/product/infiniteScrollProducts";
import Loader from "../../../_components/loader/Loader";
import ErrorComponent from "../../../_components/error/Error";
import ProductNotFound from "../../../_components/product/notFound";
import WhatsAppFloatButton from "../../../_components/buttons/whatsapp";

const CategoryPage: NextPage = () => {
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    getInitialProducts();
  }, [slug]);

  const getProducts = async (page = 1): Promise<Product[]> => {
    try {
      if (page === 1) setIsLoading(true);
      setError(null);
      const res = await fetch(
        `/api/products?category=${slug}&available=true&page=${page}&limit=16`
      );
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
          <h1 className="text-3xl font-bold mb-6">Category: {slug}</h1>

          {isLoading && <Loader />}

          {!isLoading && initialProducts.length > 0 && (
            <InfiniteScrollProducts
              initialProducts={initialProducts}
              fetchMoreProducts={fetchMoreProducts}
            />
          )}

          {!isLoading && initialProducts.length === 0 && <ProductNotFound />}
        </div>

        <WhatsAppFloatButton phoneNumber={BUSINESS_PHONE_NUMBER} />

        <MainFooter />
      </div>
    </>
  );
};

export default CategoryPage;
