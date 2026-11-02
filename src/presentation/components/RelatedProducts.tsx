import { Image } from "expo-image";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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
      <FlatList
        contentContainerStyle={styles.row}
        data={products}
        horizontal
        initialNumToRender={10}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled
        renderItem={({ item, index }) => {
          const title = item.title?.trim();
          return (
            <Pressable
              accessibilityLabel={title ? title : `View related product ${index + 1}`}
              accessibilityRole="button"
              onPress={() => onPress(item.imageUrl)}
              style={styles.thumb}
              testID={`related-${item.id}`}
            >
              <Image contentFit="cover" source={{ uri: item.imageUrl }} style={styles.image} />
            </Pressable>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />
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
    color: theme.color.muted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  row: {
    gap: 12,
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
