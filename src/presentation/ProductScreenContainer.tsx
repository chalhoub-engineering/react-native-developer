import { useRouter } from "expo-router";

import { isSelectionOffered } from "@/domain/product";
import { useGetCatalogQuery } from "@/infrastructure/http/catalogApi";
import { CatalogFallback } from "@/presentation/components/CatalogFallback";
import { ProductScreen } from "@/presentation/ProductScreen";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addedToBag,
  categorySelected,
  colorSelected,
  lightboxClosed,
  lightboxOpened,
  logoPressed,
  searchChanged,
  selectActiveCategory,
  selectCartCount,
  selectFilteredRelated,
  selectLightboxImageUrl,
  selectLightboxOpen,
  selectProductVisible,
  selectSearchQuery,
  selectSelectedColor,
  selectSelectedSize,
  sizeSelected,
} from "@/store/productUiSlice";

export function ProductScreenContainer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const category = useAppSelector(selectActiveCategory);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedSize = useAppSelector(selectSelectedSize);
  const selectedColorId = useAppSelector(selectSelectedColor);
  const count = useAppSelector(selectCartCount);
  const lightboxOpen = useAppSelector(selectLightboxOpen);
  const lightboxImageUrl = useAppSelector(selectLightboxImageUrl);
  const catalogQuery = useGetCatalogQuery();
  const catalog = catalogQuery.data;

  if (!catalog) {
    if (catalogQuery.isError && !catalogQuery.isFetching) {
      return <CatalogFallback mode="error" onRetry={() => catalogQuery.refetch()} />;
    }
    return <CatalogFallback />;
  }

  const product = catalog.product;
  const offered = isSelectionOffered(product, selectedSize, selectedColorId);

  return (
    <ProductScreen
      cartCount={count}
      category={category}
      lightboxImageUrl={lightboxImageUrl}
      lightboxOpen={lightboxOpen}
      onAddToBag={() => {
        if (!offered || selectedSize === null || selectedColorId === null) {
          return;
        }
        dispatch(
          addedToBag({
            productId: product.id,
            size: selectedSize,
            colorId: selectedColorId,
          }),
        );
      }}
      onCategoryChange={(next) => dispatch(categorySelected(next))}
      onCloseLightbox={() => dispatch(lightboxClosed())}
      onColorChange={(colorId) => dispatch(colorSelected(colorId))}
      onLogoPress={() => dispatch(logoPressed())}
      onOpenAccount={() => router.push("/account")}
      onOpenImage={(imageUrl) => dispatch(lightboxOpened(imageUrl))}
      onSearchChange={(value) => dispatch(searchChanged(value))}
      onSizeChange={(size) => dispatch(sizeSelected(size))}
      product={product}
      productVisible={selectProductVisible(category, product.category)}
      relatedProducts={selectFilteredRelated(catalog.relatedProducts, searchQuery)}
      searchQuery={searchQuery}
      selectedColorId={selectedColorId}
      selectedSize={selectedSize}
    />
  );
}
