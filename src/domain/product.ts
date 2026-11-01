import type { Money } from "@/domain/money";

export const CATEGORIES = ["MEN", "WOMEN", "KIDS", "FTW", "ACCESSORIES"] as const;

export type Category = (typeof CATEGORIES)[number];

export const SIZES = ["S", "M", "L", "XL"] as const;

export type Size = (typeof SIZES)[number];

export type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

export type ProductDescription = {
  summary: string;
  details: string[];
};

export type Product = {
  id: string;
  title: string;
  price: Money;
  imageUrl: string;
  category: Category;
  sizes: Size[];
  colors: ColorOption[];
  description: ProductDescription;
};

export type RelatedProduct = {
  id: string;
  imageUrl: string;
  title?: string;
};

export type Catalog = {
  product: Product;
  relatedProducts: RelatedProduct[];
};

export function defaultSize(sizes: readonly Size[], preferred: Size = "M"): Size | null {
  if (sizes.includes(preferred)) {
    return preferred;
  }
  return sizes[0] ?? null;
}

export function defaultColor(
  colors: readonly ColorOption[],
  preferredId = "black",
): ColorOption | null {
  return colors.find((color) => color.id === preferredId) ?? colors[0] ?? null;
}

export function isProductVisible(activeCategory: Category, productCategory: Category): boolean {
  return activeCategory === productCategory;
}

export function filterRelatedProducts(
  related: readonly RelatedProduct[],
  query: string,
): RelatedProduct[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [...related];
  }
  return related.filter((item) => (item.title ?? "").toLowerCase().includes(needle));
}
