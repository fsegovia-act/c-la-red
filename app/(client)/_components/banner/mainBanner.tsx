"use client";

import { useRouter } from "next/navigation";

const NEXT_PUBLIC_NAME = process.env.NEXT_PUBLIC_NAME;

const MainBanner = () => {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bienvenido a {NEXT_PUBLIC_NAME} Tienda Online
            </h1>
            <p className="text-xl mb-6">
              Los mejores productos, los mejores precios. Descubre nuestro
              catálogo exclusivo.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push(`/products`)}
                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-md font-bold hover:bg-yellow-500 transition duration-300 hover:cursor-pointer"
              >
                Ver Productos
              </button>
              <button
                onClick={() => router.push(`/about-us`)}
                className="bg-transparent border-2 border-white px-6 py-3 rounded-md font-bold hover:bg-white hover:text-blue-900 transition duration-300 hover:cursor-pointer"
              >
                Sobre Nosotros
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 text-lg">Banner Image</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default MainBanner;
