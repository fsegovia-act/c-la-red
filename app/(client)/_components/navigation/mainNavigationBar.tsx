"use client";

import Link from "next/link";
import { BUSINESS_NAME } from "../../_lib/constant";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./logo/Logo";
import MobileMenu from "./menu/MobileMenu";

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

const MainNavigationBar = () => {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");

  const onHandleChange = (e) => {
    let value = e.target.value;
    setSearch(value);
  };

  const navItems = [
    {
      label: "Categories",
      href: "/categories",
    },
    {
      label: "Offers",
      href: "/offers",
    },
    { label: "Sign In", href: "/sign-in" },
  ];

  return (
    <header className="bg-yellow-400 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Tablet and desktop resolution */}
          <div className="flex hidden sm:flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-900">
              {BUSINESS_NAME}
            </Link>
          </div>

          {/* Mobile resolution */}
          <div className="flex sm:hidden items-center min-h-[50px] min-w-[50px]">
            <Logo
              src={`${NEXT_PUBLIC_S3_BASE_URL}/images/business/c-la-red-logo.jpg`}
              alt={"c-la-red-logo"}
              className={""}
            />
          </div>

          {/* Input Search */}
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

          {/* Desktop resolution */}
          <nav className="flex hidden md:flex">
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

          {/* Tablet and mobile resolution */}
          <div className="flex md:hidden">
            <MobileMenu
              navItems={navItems}
              variant="slide-right"
              colorScheme="light"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
export default MainNavigationBar;
