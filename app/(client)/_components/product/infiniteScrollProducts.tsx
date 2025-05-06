"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "../../_lib/interfaces";
import ProductCard from "./productCard";

interface InfiniteScrollProductsProps {
  initialProducts: Product[];
  fetchMoreProducts: (page: number) => Promise<Product[]>;
}

export default function InfiniteScrollProducts({
  initialProducts,
  fetchMoreProducts,
}: InfiniteScrollProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const loadMoreProducts = useCallback(async () => {
    try {
      if (loading || !hasMore) return;

      setLoading(true);
      const nextPage = page + 1;
      const newProducts = await fetchMoreProducts(nextPage);

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, fetchMoreProducts]);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMoreProducts]);

  return (
    <div className="products-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          if (index === products.length - 1) {
            return (
              <ProductCard
                key={product._id}
                product={product}
                ref={lastProductRef}
              />
            );
          }

          return <ProductCard key={product._id} product={product} />;
        })}
      </div>

      {loading && (
        <div className="loading-indicator text-center py-4">
          <p>Loading more products...</p>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="end-message text-center py-4">
          <p>No more products to load</p>
        </div>
      )}
    </div>
  );
}
