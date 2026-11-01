import { CATEGORIES, SIZES, type Catalog, type Category, type ColorOption, type Size } from "@/domain/product";
import type { Money } from "@/domain/money";

export class CatalogMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogMappingError";
  }
}

const sizeSet = new Set<string>(SIZES);
const categorySet = new Set<string>(CATEGORIES);

export function mapCatalog(input: unknown): Catalog {
  const record = asRecord(input, "catalog");
  return {
    product: mapProduct(record.product),
    relatedProducts: mapRelated(record.relatedProducts),
  };
}

function mapProduct(input: unknown) {
  const record = asRecord(input, "product");
  return {
    id: requireString(record, "id"),
    title: requireString(record, "title"),
    price: mapPrice(record.price),
    imageUrl: requireString(record, "imageUrl"),
    category: mapCategory(record.category),
    sizes: mapSizes(record.sizes),
    colors: mapColors(record.colors),
    description: mapDescription(record.description),
  };
}

function mapPrice(input: unknown): Money {
  const record = asRecord(input, "price");
  if (typeof record.amount !== "number" || typeof record.currency !== "string" || record.currency.trim() === "") {
    throw new CatalogMappingError("Missing price");
  }
  return { amount: record.amount, currency: record.currency };
}

function mapCategory(input: unknown): Category {
  if (typeof input !== "string" || !categorySet.has(input)) {
    throw new CatalogMappingError("Missing category");
  }
  return input as Category;
}

function mapSizes(input: unknown): Size[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new CatalogMappingError("Missing sizes");
  }
  return input.map((size) => {
    if (typeof size !== "string" || !sizeSet.has(size)) {
      throw new CatalogMappingError("Missing sizes");
    }
    return size as Size;
  });
}

function mapColors(input: unknown): ColorOption[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new CatalogMappingError("Missing colors");
  }
  return input.map((color) => {
    const record = asRecord(color, "colors");
    return {
      id: requireString(record, "id"),
      name: requireString(record, "name"),
      hex: requireString(record, "hex"),
    };
  });
}

function mapDescription(input: unknown) {
  const record = asRecord(input, "description");
  if (typeof record.summary !== "string") {
    throw new CatalogMappingError("Missing description");
  }
  if (!Array.isArray(record.details) || record.details.some((line) => typeof line !== "string")) {
    throw new CatalogMappingError("Missing description");
  }
  return { summary: record.summary, details: record.details };
}

function mapRelated(input: unknown) {
  if (input === undefined) {
    return [];
  }
  if (!Array.isArray(input)) {
    throw new CatalogMappingError("Missing related products");
  }
  return input.map((item, index) => {
    const record = asRecord(item, "related imageUrl");
    const imageUrl = requireString(record, "imageUrl");
    const id = typeof record.id === "string" && record.id.trim() !== "" ? record.id : `related-${index}`;
    const title = typeof record.title === "string" ? record.title : undefined;
    return { id, imageUrl, title };
  });
}

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new CatalogMappingError(`Missing ${key}`);
  }
  return value;
}

function asRecord(input: unknown, label: string): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new CatalogMappingError(`Missing ${label}`);
  }
  return input as Record<string, unknown>;
}
