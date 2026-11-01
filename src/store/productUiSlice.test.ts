import {
  addedToBag,
  categorySelected,
  colorSelected,
  initialProductUiState,
  lightboxClosed,
  lightboxOpened,
  logoPressed,
  productUiReducer,
  searchChanged,
  selectCartCount,
  selectFilteredRelated,
  selectProductVisible,
  sizeSelected,
  type ProductUiState,
} from "@/store/productUiSlice";

function withUi(state: ProductUiState) {
  return { productUi: state };
}

describe("productUiSlice", () => {
  it("selects a size", () => {
    const state = productUiReducer(initialProductUiState, sizeSelected("XL"));
    expect(state.selectedSize).toBe("XL");
  });

  it("selects a color", () => {
    const state = productUiReducer(initialProductUiState, colorSelected("forest"));
    expect(state.selectedColorId).toBe("forest");
  });

  it("selects a category", () => {
    const state = productUiReducer(initialProductUiState, categorySelected("KIDS"));
    expect(state.selectedCategory).toBe("KIDS");
  });

  it("stores a trimmed search query", () => {
    const state = productUiReducer(initialProductUiState, searchChanged("  blue  "));
    expect(state.searchQuery).toBe("blue");
  });

  it("adds a bag line and increases quantity for the same selection", () => {
    const draft = { productId: "tiger-medium-red", size: "M" as const, colorId: "black" };
    const once = productUiReducer(initialProductUiState, addedToBag(draft));
    const twice = productUiReducer(once, addedToBag(draft));
    expect(selectCartCount(withUi(once))).toBe(1);
    expect(selectCartCount(withUi(twice))).toBe(2);
    expect(twice.cart[0]?.quantity).toBe(2);
  });

  it("filters related products by title without case sensitivity", () => {
    const related = [
      { id: "blue", imageUrl: "https://example.com/blue.jpg", title: "Tiger Light Blue" },
      { id: "black", imageUrl: "https://example.com/black.jpg", title: "Tiger Black" },
    ];
    expect(selectFilteredRelated(related, "BLUE").map((item) => item.id)).toEqual(["blue"]);
  });

  it("shows the product only in its own category", () => {
    expect(selectProductVisible("MEN", "MEN")).toBe(true);
    expect(selectProductVisible("KIDS", "MEN")).toBe(false);
  });

  it("opens and closes the lightbox", () => {
    const open = productUiReducer(initialProductUiState, lightboxOpened("https://example.com/shirt.jpg"));
    expect(open.lightbox).toEqual({ open: true, imageUrl: "https://example.com/shirt.jpg" });
    const closed = productUiReducer(open, lightboxClosed());
    expect(closed.lightbox).toEqual({ open: false, imageUrl: null });
  });

  it("resets category, search, and the lightbox when the logo is pressed", () => {
    let state = productUiReducer(initialProductUiState, categorySelected("KIDS"));
    state = productUiReducer(state, searchChanged("blue"));
    state = productUiReducer(state, lightboxOpened("https://example.com/shirt.jpg"));
    state = productUiReducer(state, logoPressed());
    expect(state.selectedCategory).toBe("MEN");
    expect(state.searchQuery).toBe("");
    expect(state.lightbox.open).toBe(false);
    expect(state.selectedSize).toBe("M");
  });
});
