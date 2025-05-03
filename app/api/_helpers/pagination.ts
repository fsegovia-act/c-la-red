import { CATEGORIES } from "../../(client)/_lib/constant";

export function getPaginationParams(url: string) {
  const { searchParams } = new URL(url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export const validateCategory = (slug) => {
  let isValidCategory = false;
  let validCategories = "";

  CATEGORIES.forEach((category) => {
    if (category.slug === slug) isValidCategory = true;

    if (validCategories)
      validCategories = validCategories + ", " + category.slug;
    if (!validCategories) validCategories = category.slug;;
  });

  if (isValidCategory) return isValidCategory;

  throw Error(`Invalid category. Allowed categories: ${validCategories}.`);
};
