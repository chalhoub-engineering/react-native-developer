import { catalogFixture } from "@/infrastructure/fixture/catalogFixture";

describe("fixture catalog", () => {
  it("returns the product fields the layout needs", () => {
    expect(catalogFixture.product.title).toBe("Tiger Medium Red");
    expect(catalogFixture.product.price).toEqual({ amount: 250, currency: "AED" });
    expect(catalogFixture.product.sizes).toEqual(["S", "M", "L", "XL"]);
    expect(catalogFixture.product.colors).toHaveLength(4);
    expect(catalogFixture.product.description.summary.length).toBeGreaterThan(0);
    expect(catalogFixture.product.description.details.length).toBeGreaterThan(0);
    expect(catalogFixture.relatedProducts).toHaveLength(4);
    expect(catalogFixture.relatedProducts.every((item) => item.imageUrl.startsWith("https://"))).toBe(
      true,
    );
  });
});
