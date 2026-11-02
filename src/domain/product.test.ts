import { defaultColor, defaultSize, resolveSelection, type Product } from "@/domain/product";

const shirt: Product = {
  id: "tiger-medium-red",
  title: "Tiger Medium Red",
  price: { amount: 250, currency: "AED" },
  imageUrl: "https://example.com/red.jpg",
  category: "MEN",
  sizes: ["S", "M", "L", "XL"],
  colors: [
    { id: "black", name: "Black", hex: "#1a1a1a" },
    { id: "forest", name: "Forest", hex: "#12382f" },
  ],
  description: { summary: "A shirt.", details: ["Short sleeved."] },
};

describe("selection defaults", () => {
  it("uses M when M is in the size list", () => {
    expect(defaultSize(["S", "M", "L", "XL"])).toBe("M");
  });

  it("keeps a saved variant for the same product and replaces one the product no longer offers", () => {
    const kept = resolveSelection(shirt, {
      productId: "tiger-medium-red",
      size: "XL",
      colorId: "forest",
    });
    expect(kept).toEqual({ productId: "tiger-medium-red", size: "XL", colorId: "forest" });

    const dropped = resolveSelection(
      { ...shirt, sizes: ["S", "M", "L"], colors: shirt.colors.slice(0, 1) },
      { productId: "tiger-medium-red", size: "XL", colorId: "forest" },
    );
    expect(dropped).toEqual({ productId: "tiger-medium-red", size: "M", colorId: "black" });
  });

  it("resets the variant when the product id changes", () => {
    const next = resolveSelection(
      { ...shirt, id: "other-shirt" },
      { productId: "tiger-medium-red", size: "XL", colorId: "forest" },
    );
    expect(next).toEqual({ productId: "other-shirt", size: "M", colorId: "black" });
  });

  it("uses the black swatch when it is present", () => {
    expect(
      defaultColor([
        { id: "white", name: "White", hex: "#ffffff" },
        { id: "black", name: "Black", hex: "#1a1a1a" },
      ])?.id,
    ).toBe("black");
  });
});
