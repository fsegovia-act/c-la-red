"use client";

import Link from "next/link";
import { BUSINESS_NAME } from "../../_lib/constant";

const AdminNavigationBar = () => {
  return (
    <header className="bg-pink-400 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/products/management"
              className="text-2xl font-bold text-blue-900"
            >
              {BUSINESS_NAME} (Admin)
            </Link>
          </div>
          <div className="flex-1 mx-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos, marcas y más..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button className="absolute right-2 top-2 text-gray-500">
                🔍
              </button>
            </div>
          </div>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium text-blue-900">
              <li>
                <Link href="/product/create" className="hover:text-blue-700">
                  Create Product
                </Link>
              </li>
              <li>
                <Link
                  href="/products/management"
                  className="hover:text-blue-700"
                >
                  Management
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default AdminNavigationBar;
