import { CatalogMappingError, mapCatalog } from "@/infrastructure/catalog/mapCatalog";
import { catalogFixture } from "@/infrastructure/fixture/catalogFixture";

function payload(): {
  product: Record<string, unknown>;
  relatedProducts: Record<string, unknown>[];
} {
  return structuredClone(catalogFixture) as never;
}

describe("mapCatalog", () => {
  it("maps a full payload to a product and four related products", () => {
    const catalog = mapCatalog(payload());
    expect(catalog.product.title).toBe("Tiger Medium Red");
    expect(catalog.product.price).toEqual({ amount: 250, currency: "AED" });
    expect(catalog.relatedProducts).toHaveLength(4);
  });

  it.each(["title", "imageUrl", "price", "sizes", "colors", "description"])(
    "rejects a payload missing %s",
    (field: string) => {
      const input = payload();
      delete input.product[field];
      expect(() => mapCatalog(input)).toThrow(CatalogMappingError);
    },
  );

  it("maps a related item that only has an image URL", () => {
    const input = payload();
    input.relatedProducts = [{ imageUrl: "https://example.com/only.jpg" }];
    const catalog = mapCatalog(input);
    expect(catalog.relatedProducts).toEqual([
      { id: "related-0", imageUrl: "https://example.com/only.jpg", title: undefined },
    ]);
  });

  it.each([
    ["a negative amount", (input: ReturnType<typeof payload>) => {
      input.product.price = { amount: -1, currency: "AED" };
    }],
    ["NaN", (input: ReturnType<typeof payload>) => {
      input.product.price = { amount: Number.NaN, currency: "AED" };
    }],
    ["a duplicate size", (input: ReturnType<typeof payload>) => {
      input.product.sizes = ["M", "M"];
    }],
    ["a bad color", (input: ReturnType<typeof payload>) => {
      input.product.colors = [{ id: "black", name: "Black", hex: "black" }];
    }],
    ["a non-https image", (input: ReturnType<typeof payload>) => {
      input.product.imageUrl = "http://example.com/shirt.jpg";
    }],
  ])("rejects %s", (_label, mutate) => {
    const input = payload();
    mutate(input);
    expect(() => mapCatalog(input)).toThrow(CatalogMappingError);
  });
});
