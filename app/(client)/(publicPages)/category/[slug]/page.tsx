"use client";

import { NextPage } from "next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MainNavigationBar from "../../../_components/navigation/mainNavigationBar";
import MainFooter from "../../../_components/footer/mainFooter";
import ProductGrid from "../../../_components/product/productGrid";
import { PUBLIC } from "../../../_lib/constant";
import { Product } from "../../../_lib/interfaces";

const CategoryPage: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products?category=${slug}&available=true`);
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
        <MainNavigationBar type={PUBLIC} />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            Category: {slug}
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

export default CategoryPage;
