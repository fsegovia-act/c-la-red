"use client";

import Link from "next/link";
import { BUSINESS_NAME } from "../../_lib/constant";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MainNavigationBar = () => {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");

  const onHandleChange = (e) => {
    let value = e.target.value;
    setSearch(value);
  };

  return (
    <header className="bg-yellow-400 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-900">
              {BUSINESS_NAME}
            </Link>
          </div>
          <div className="flex-1 mx-10">
            <div className="relative">
              <input
                onChange={(e) => onHandleChange(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    router.push(`/products?search=${search}`);
                }}
                value={search}
                type="text"
                placeholder="Buscar productos, marcas y más..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => router.push(`/products?search=${search}`)}
                className="absolute right-2 top-2 text-gray-500"
              >
                🔍
              </button>
            </div>
          </div>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium text-blue-900">
              <li>
                <Link href="/categories" className="hover:text-blue-700">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-blue-700">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-blue-700">
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default MainNavigationBar;
