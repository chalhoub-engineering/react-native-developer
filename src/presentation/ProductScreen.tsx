import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatPrice } from "@/domain/money";
import type { Category, Product, RelatedProduct, Size } from "@/domain/product";
import { CATEGORIES, isSelectionOffered } from "@/domain/product";
import { AddToBagButton } from "@/presentation/components/AddToBagButton";
import { CategoryNav } from "@/presentation/components/CategoryNav";
import { ColorSelector } from "@/presentation/components/ColorSelector";
import { Description } from "@/presentation/components/Description";
import { EmptyCatalog } from "@/presentation/components/EmptyCatalog";
import { Header } from "@/presentation/components/Header";
import { ImageLightbox } from "@/presentation/components/ImageLightbox";
import { ProductImage } from "@/presentation/components/ProductImage";
import { RelatedProducts } from "@/presentation/components/RelatedProducts";
import { SearchBar } from "@/presentation/components/SearchBar";
import { SizeSelector } from "@/presentation/components/SizeSelector";
import { theme } from "@/presentation/theme";

export type ProductScreenProps = {
  product: Product;
  relatedProducts: readonly RelatedProduct[];
  productVisible: boolean;
  category: Category;
  searchQuery: string;
  selectedSize: Size | null;
  selectedColorId: string | null;
  cartCount: number;
  lightboxOpen: boolean;
  lightboxImageUrl: string | null;
  onLogoPress: () => void;
  onOpenAccount: () => void;
  onCategoryChange: (category: Category) => void;
  onSearchChange: (query: string) => void;
  onSizeChange: (size: Size) => void;
  onColorChange: (colorId: string) => void;
  onAddToBag: () => void;
  onOpenImage: (imageUrl: string) => void;
  onCloseLightbox: () => void;
};

export function ProductScreen({
  product,
  relatedProducts,
  productVisible,
  category,
  searchQuery,
  selectedSize,
  selectedColorId,
  cartCount,
  lightboxOpen,
  lightboxImageUrl,
  onLogoPress,
  onOpenAccount,
  onCategoryChange,
  onSearchChange,
  onSizeChange,
  onColorChange,
  onAddToBag,
  onOpenImage,
  onCloseLightbox,
}: ProductScreenProps) {
  return (
    <View style={styles.page}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Header onAccountPress={onOpenAccount} onLogoPress={onLogoPress} />
          <CategoryNav categories={CATEGORIES} onSelect={onCategoryChange} selected={category} />
          <SearchBar onChange={onSearchChange} value={searchQuery} />
          {productVisible ? (
            <View>
              <ProductImage imageUrl={product.imageUrl} onExpand={() => onOpenImage(product.imageUrl)} />
              <Text style={styles.title} testID="product-title">
                {product.title}
              </Text>
              <Text style={styles.price} testID="product-price">
                {formatPrice(product.price)}
              </Text>
              <SizeSelector onSelect={onSizeChange} selected={selectedSize} sizes={product.sizes} />
              <ColorSelector
                colors={product.colors}
                onSelect={onColorChange}
                selectedId={selectedColorId}
              />
              <AddToBagButton
                count={cartCount}
                disabled={!isSelectionOffered(product, selectedSize, selectedColorId)}
                onPress={onAddToBag}
              />
              <Description details={product.description.details} summary={product.description.summary} />
              <RelatedProducts onPress={onOpenImage} products={relatedProducts} />
            </View>
          ) : (
            <EmptyCatalog />
          )}
        </ScrollView>
        <ImageLightbox imageUrl={lightboxImageUrl} onClose={onCloseLightbox} visible={lightboxOpen} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.color.background,
    flex: 1,
  },
  safe: {
    alignSelf: "center",
    flex: 1,
    maxWidth: 480,
    width: "100%",
  },
  content: {
    paddingBottom: 36,
    paddingHorizontal: theme.space.screen,
  },
  title: {
    color: theme.color.text,
    fontSize: 20,
    fontWeight: "500",
  },
  price: {
    color: theme.color.muted,
    fontSize: 16,
    marginTop: 6,
  },
});
