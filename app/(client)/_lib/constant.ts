export const BUSINESS_NAME: string = "C La Red";
export const BUSINESS_ADDRESS: string = "Jorge Odiard 2131";
export const BUSINESS_EMAIL: string = "cyberlaredconcordia@mail.com";
export const BUSINESS_PHONE_NUMBER: string = "+5493456260360";

export const PUBLIC = "public";
export const PRIVATE = "private";
export const PRODUCTION = "production";

export const PUBLIC_MENU_ITEMS = [
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

export const PRIVATE_MENU_ITEMS = [
  {
    label: "Create Product",
    href: "/product/create",
  },
  {
    label: "Management",
    href: "/products/management",
  },
  { label: "Sign Out", href: "/sign-out" },
];

export const defaultImageUrl = "/images/products/image-product-default.jpg";

export const CATEGORIES = [
  {
    id: 1,
    name: "Tecnología",
    icon: "🖥️",
    slug: "tech",
    url: "/category/tech",
  },
  {
    id: 2,
    name: "Accesorios",
    icon: "📱",
    slug: "accessories",
    url: "/category/accessories",
  },
  {
    id: 3,
    name: "Mascotas",
    icon: "🐕",
    slug: "pets",
    url: "/category/pets",
  },
  {
    id: 4,
    name: "Ropa",
    icon: "👕",
    slug: "clothing",
    url: "/category/clothing",
  },
  {
    id: 5,
    name: "Reparación",
    icon: "🛠️",
    slug: "service",
    url: "/category/service",
  },
];