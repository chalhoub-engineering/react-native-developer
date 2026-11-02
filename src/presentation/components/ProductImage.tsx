import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { theme } from "@/presentation/theme";

type ProductImageProps = {
  imageUrl: string;
  onExpand: () => void;
};

export function ProductImage({ imageUrl, onExpand }: ProductImageProps) {
  return (
    <View style={styles.panel}>
      <Image contentFit="contain" source={{ uri: imageUrl }} style={styles.image} />
      <Pressable
        accessibilityLabel="Expand image"
        accessibilityRole="button"
        hitSlop={expandHitSlop}
        onPress={onExpand}
        style={styles.expand}
        testID="expand-image"
      >
        <ExpandIcon />
      </Pressable>
    </View>
  );
}

function ExpandIcon() {
  return (
    <View style={styles.icon}>
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
    </View>
  );
}

const expandHitSlop = { top: 8, right: 8, bottom: 8, left: 8 };

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.color.panel,
    height: 390,
    marginBottom: 22,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  expand: {
    alignItems: "center",
    bottom: 14,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 14,
    width: 28,
  },
  icon: {
    height: 16,
    width: 16,
  },
  corner: {
    borderColor: "#8d8d8d",
    height: 6,
    position: "absolute",
    width: 6,
  },
  topLeft: {
    borderLeftWidth: 1.5,
    borderTopWidth: 1.5,
    left: 0,
    top: 0,
  },
  topRight: {
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    right: 0,
    top: 0,
  },
  bottomLeft: {
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    bottom: 0,
    right: 0,
  },
});
