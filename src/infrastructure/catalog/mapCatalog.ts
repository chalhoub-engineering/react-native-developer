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
const MAX_TEXT = 500;
const MAX_SUMMARY = 2000;
const MAX_SIZES = 20;
const MAX_COLORS = 20;
const MAX_RELATED = 50;
const MAX_DETAILS = 20;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const CURRENCY = /^[A-Z]{3}$/;

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
    imageUrl: requireHttpsUrl(requireString(record, "imageUrl"), "imageUrl"),
    category: mapCategory(record.category),
    sizes: mapSizes(record.sizes),
    colors: mapColors(record.colors),
    description: mapDescription(record.description),
  };
}

function mapPrice(input: unknown): Money {
  const record = asRecord(input, "price");
  if (typeof record.amount !== "number" || !Number.isFinite(record.amount) || record.amount < 0) {
    throw new CatalogMappingError("Missing price");
  }
  if (typeof record.currency !== "string" || !CURRENCY.test(record.currency)) {
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
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_SIZES) {
    throw new CatalogMappingError("Missing sizes");
  }
  const sizes = input.map((size) => {
    if (typeof size !== "string" || !sizeSet.has(size)) {
      throw new CatalogMappingError("Missing sizes");
    }
    return size as Size;
  });
  if (new Set(sizes).size !== sizes.length) {
    throw new CatalogMappingError("Missing sizes");
  }
  return sizes;
}

function mapColors(input: unknown): ColorOption[] {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_COLORS) {
    throw new CatalogMappingError("Missing colors");
  }
  const colors = input.map((color) => {
    const record = asRecord(color, "colors");
    const hex = requireString(record, "hex");
    if (!HEX_COLOR.test(hex)) {
      throw new CatalogMappingError("Missing colors");
    }
    return {
      id: requireString(record, "id"),
      name: requireString(record, "name"),
      hex,
    };
  });
  if (new Set(colors.map((color) => color.id)).size !== colors.length) {
    throw new CatalogMappingError("Missing colors");
  }
  return colors;
}

function mapDescription(input: unknown) {
  const record = asRecord(input, "description");
  if (typeof record.summary !== "string" || record.summary.length > MAX_SUMMARY) {
    throw new CatalogMappingError("Missing description");
  }
  if (
    !Array.isArray(record.details) ||
    record.details.length > MAX_DETAILS ||
    record.details.some((line) => typeof line !== "string" || line.length > MAX_TEXT)
  ) {
    throw new CatalogMappingError("Missing description");
  }
  return { summary: record.summary, details: record.details };
}

function mapRelated(input: unknown) {
  if (input === undefined) {
    return [];
  }
  if (!Array.isArray(input) || input.length > MAX_RELATED) {
    throw new CatalogMappingError("Missing related products");
  }
  const related = input.map((item, index) => {
    const record = asRecord(item, "related imageUrl");
    const imageUrl = requireHttpsUrl(requireString(record, "imageUrl"), "imageUrl");
    const id = typeof record.id === "string" && record.id.trim() !== "" ? record.id : `related-${index}`;
    if (id.length > MAX_TEXT) {
      throw new CatalogMappingError("Missing id");
    }
    const title =
      typeof record.title === "string" && record.title.trim() !== "" ? record.title : undefined;
    if (title !== undefined && title.length > MAX_TEXT) {
      throw new CatalogMappingError("Missing title");
    }
    return { id, imageUrl, title };
  });
  if (new Set(related.map((item) => item.id)).size !== related.length) {
    throw new CatalogMappingError("Missing related products");
  }
  return related;
}

function requireHttpsUrl(value: string, label: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new CatalogMappingError(`Missing ${label}`);
  }
  if (url.protocol !== "https:") {
    throw new CatalogMappingError(`Missing ${label}`);
  }
  return value;
}

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "" || value.length > MAX_TEXT) {
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
