import { CatalogMappingError, mapCatalog } from "@/infrastructure/catalog/mapCatalog";
import { catalogFixture } from "@/infrastructure/fixture/catalogFixture";

function payload(): {
  product: Record<string, unknown>;
  relatedProducts: Array<Record<string, unknown>>;
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
});
