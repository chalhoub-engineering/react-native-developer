import { defaultColor, defaultSize } from "@/domain/product";

describe("selection defaults", () => {
  it("uses M when M is in the size list", () => {
    expect(defaultSize(["S", "M", "L", "XL"])).toBe("M");
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
