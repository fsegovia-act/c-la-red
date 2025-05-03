"use client";

import Link from "next/link";
import { CATEGORIES } from "../../_lib/constant";

const CategoryBanner = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Categorías destacadas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.id}
              className="bg-gray-100 rounded-lg p-6 text-center hover:shadow-lg transition duration-300"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CategoryBanner;
