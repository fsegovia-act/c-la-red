"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";
import { Product } from "../../_lib/interfaces";
import { BUSINESS_PHONE_NUMBER } from "../../_lib/constant";
import { formatPrice } from "../../_lib/helpers";

interface ProductProps {
  product: Product;
}

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

const InfoProduct: React.FC<ProductProps> = ({ product }: ProductProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullUrl = `${window.location.origin}${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="product-image">
        {product.imageUrl ? (
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={`${NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>

      <div className="product-details">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        <div className="text-xl font-semibold text-blue-600 mb-4">
          ${formatPrice(product.price)}
        </div>

        <div className="mb-6">
          <p className="text-gray-700 whitespace-pre-line">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{product.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">SKU</p>
            <p className="font-medium">{product.sku}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Availability</p>
            <p className="font-medium">
              {product.isAvailable ? (
                <span className="text-green-600">
                  In Stock ({product.stockQuantity})
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          </div>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          className={`w-full py-3 px-4 rounded-lg font-medium mb-5 ${
            product.isAvailable
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!product.isAvailable}
        >
          <a
            href={`https://wa.me/${BUSINESS_PHONE_NUMBER}?text=Hola%20*C-La-Red*,%20acabo%20de%20visualizar%20el%20producto%20_*${product.name}%20-%20${product.sku}*_%20dentro%20de%20su%20sitio%20web%20y%20me%20gustaría%20ser%20contactado/a%20para%20obtener%20más%20información.%0A${fullUrl}`}
            target="blanck"
          >
            {product.isAvailable ? "Contact" : "Out of Stock"}
          </a>
        </button>

        <div
          className={`w-full py-3 px-4 rounded-lg font-medium flex justify-around pt-4`}
        >
          <p>Share:</p>

          <WhatsappShareButton
            url={fullUrl}
            title={`Hola, quisiera compartir contigo el producto ${product.name} - ${product.sku} que vi en el sitio web de C-La-Red y que creo que podría ser de tu interés. Saludos.`}
            separator=":: "
          >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          <FacebookMessengerShareButton url={fullUrl} appId={""}>
            <FacebookMessengerIcon size={40} round />
          </FacebookMessengerShareButton>

          <EmailShareButton
            url={fullUrl}
            subject={`C-La-Red - ${product.name}`}
            body={`Hola, acabo de visualizar el producto ${product.name} - ${product.sku} dentro del sitio sitio web de C-La-Red y me gustaría compartir el enlace contigo porque creo que podría interesarte. Saludos.`}
          >
            <EmailIcon size={40} round />
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
};
export default InfoProduct;
