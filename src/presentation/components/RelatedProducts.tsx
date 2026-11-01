import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { RelatedProduct } from "@/domain/product";
import { theme } from "@/presentation/theme";

type RelatedProductsProps = {
  products: readonly RelatedProduct[];
  onPress: (imageUrl: string) => void;
};

export function RelatedProducts({ products, onPress }: RelatedProductsProps) {
  return (
    <View style={styles.block}>
      <View style={styles.divider} />
      <Text style={styles.heading}>SEE MORE PRODUCTS</Text>
      <View style={styles.row}>
        {products.map((product) => (
          <Pressable
            accessibilityRole="button"
            key={product.id}
            onPress={() => onPress(product.imageUrl)}
            style={styles.thumb}
            testID={`related-${product.id}`}
          >
            <Image contentFit="cover" source={{ uri: product.imageUrl }} style={styles.image} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 28,
  },
  divider: {
    backgroundColor: theme.color.line,
    height: 1,
    marginBottom: 22,
  },
  heading: {
    color: "#9a9a9a",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  thumb: {
    backgroundColor: theme.color.panel,
    height: 84,
    width: 72,
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
