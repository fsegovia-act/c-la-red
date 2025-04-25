"use client";

import Link from "next/link";
import { BUSINESS_ADDRESS, BUSINESS_EMAIL, BUSINESS_NAME, BUSINESS_PHONE_NUMBER } from "../../_lib/constant";

const CATEGORIES = [
  { id: 1, name: "Electrónicos", icon: "🖥️", url: "/category/electronics" },
  { id: 2, name: "Hogar", icon: "🏠", url: "/category/home" },
  { id: 3, name: "Tecnología", icon: "📱", url: "/category/tech" },
  { id: 4, name: "Accesorios", icon: "⌚", url: "/category/accessories" },
  { id: 5, name: "Ropa", icon: "👕", url: "/category/clothing" },
];

const MainFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              {BUSINESS_NAME} Tienda Online
            </h3>
            <p className="text-gray-300 mb-4">
              Ofreciendo los mejores productos desde 2020. Tu satisfacción es
              nuestra prioridad.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span>FB</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span>IG</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span>TW</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Categorías</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link
                    href={category.url}
                    className="text-gray-300 hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-white"
                >
                  Envíos
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-white"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Dirección: {BUSINESS_ADDRESS}</li>
              <li>Teléfono: {BUSINESS_PHONE_NUMBER}</li>
              <li>Email: {BUSINESS_EMAIL}</li>
              <li>Horario: Lun-Vie 9:00-18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS_NAME} Tienda Online.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default MainFooter;
