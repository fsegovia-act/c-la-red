"use client";

import { formatPrice } from "../../_lib/helpers";
import { Product } from "../../_lib/interfaces";

const SPECIAL_OFFERS: Product[] = [
  {
    _id: "5",
    name: "Super Descuento",
    description: "50% de descuento solo hoy",
    price: 149.99,
    sku: "SKU005",
    category: "Electrónicos",
    stockQuantity: 3,
    isAvailable: true,
    imageUrl: "/images/offer-1.jpg",
    tags: ["oferta", "descuento", "limitado"],
  },
  {
    _id: "6",
    name: "Pack Especial",
    description: "Combo de productos con 30% de descuento",
    price: 799.99,
    sku: "SKU006",
    category: "Hogar",
    stockQuantity: 8,
    isAvailable: true,
    imageUrl: "/images/offer-2.jpg",
    tags: ["pack", "oferta"],
  },
];

const SpecialOffersBanner = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Ofertas especiales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SPECIAL_OFFERS.map((offer) => (
            <div
              key={offer._id}
              className="flex flex-col md:flex-row bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-md overflow-hidden"
            >
              <div className="md:w-1/3 bg-gray-200 flex items-center justify-center p-6">
                <span className="text-gray-500">Imagen de oferta</span>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium">
                    Oferta limitada
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-800">
                  {offer.name}
                </h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-blue-700 mr-3">
                    {formatPrice(offer.price)}
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    {formatPrice(offer.price * 1.25)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600 font-medium">
                    ¡Solo quedan {offer.stockQuantity} disponibles!
                  </span>
                  <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition duration-300">
                    Ver ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default SpecialOffersBanner;
