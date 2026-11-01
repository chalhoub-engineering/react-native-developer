import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { addLine, cartCount, type CartDraft, type CartLine } from "@/domain/cart";
import {
  filterRelatedProducts,
  isProductVisible,
  type Category,
  type RelatedProduct,
  type Size,
} from "@/domain/product";

export type LightboxState = {
  open: boolean;
  imageUrl: string | null;
};

export type ProductUiState = {
  selectedCategory: Category;
  searchQuery: string;
  selectedSize: Size | null;
  selectedColorId: string | null;
  cart: CartLine[];
  lightbox: LightboxState;
};

export const initialProductUiState: ProductUiState = {
  selectedCategory: "MEN",
  searchQuery: "",
  selectedSize: "M",
  selectedColorId: "black",
  cart: [],
  lightbox: { open: false, imageUrl: null },
};

const productUiSlice = createSlice({
  name: "productUi",
  initialState: initialProductUiState,
  reducers: {
    sizeSelected(state, action: PayloadAction<Size>) {
      state.selectedSize = action.payload;
    },
    colorSelected(state, action: PayloadAction<string>) {
      state.selectedColorId = action.payload;
    },
    categorySelected(state, action: PayloadAction<Category>) {
      state.selectedCategory = action.payload;
    },
    searchChanged(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload.trim();
    },
    addedToBag(state, action: PayloadAction<CartDraft>) {
      state.cart = addLine(state.cart, action.payload);
    },
    lightboxOpened(state, action: PayloadAction<string>) {
      state.lightbox.open = true;
      state.lightbox.imageUrl = action.payload;
    },
    lightboxClosed(state) {
      state.lightbox.open = false;
      state.lightbox.imageUrl = null;
    },
    logoPressed(state) {
      state.selectedCategory = "MEN";
      state.searchQuery = "";
      state.lightbox.open = false;
      state.lightbox.imageUrl = null;
    },
  },
});

export const {
  sizeSelected,
  colorSelected,
  categorySelected,
  searchChanged,
  addedToBag,
  lightboxOpened,
  lightboxClosed,
  logoPressed,
} = productUiSlice.actions;

export const productUiReducer = productUiSlice.reducer;

export type ProductUiRoot = {
  productUi: ProductUiState;
};

export const selectActiveCategory = (state: ProductUiRoot) => state.productUi.selectedCategory;

export const selectSearchQuery = (state: ProductUiRoot) => state.productUi.searchQuery;

export const selectSelectedSize = (state: ProductUiRoot) => state.productUi.selectedSize;

export const selectSelectedColor = (state: ProductUiRoot) => state.productUi.selectedColorId;

export const selectCartCount = (state: ProductUiRoot) => cartCount(state.productUi.cart);

export const selectLightboxOpen = (state: ProductUiRoot) => state.productUi.lightbox.open;

export const selectLightboxImageUrl = (state: ProductUiRoot) => state.productUi.lightbox.imageUrl;

export function selectFilteredRelated(
  related: readonly RelatedProduct[],
  query: string,
): RelatedProduct[] {
  return filterRelatedProducts(related, query);
}

export function selectProductVisible(activeCategory: Category, productCategory: Category): boolean {
  return isProductVisible(activeCategory, productCategory);
}
