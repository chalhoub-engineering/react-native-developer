import { formatPrice } from "@/domain/money";

describe("formatPrice", () => {
  it("formats AED 250", () => {
    expect(formatPrice({ amount: 250, currency: "AED" })).toBe("AED 250");
  });
});
