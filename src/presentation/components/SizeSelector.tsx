import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Size } from "@/domain/product";
import { theme } from "@/presentation/theme";

type SizeSelectorProps = {
  sizes: readonly Size[];
  selected: Size | null;
  onSelect: (size: Size) => void;
};

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Available Sizes:</Text>
      {sizes.map((size) => {
        const isSelected = size === selected;
        return (
          <Pressable
            accessibilityLabel={`Size ${size}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            hitSlop={textHitSlop}
            key={size}
            onPress={() => onSelect(size)}
            testID={`size-${size}`}
          >
            <Text style={[styles.size, isSelected && styles.sizeSelected]}>{size}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const textHitSlop = { top: 14, right: 10, bottom: 14, left: 10 };

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    marginTop: 18,
  },
  label: {
    color: theme.color.muted,
    fontSize: 16,
    marginRight: 4,
  },
  size: {
    color: theme.color.muted,
    fontSize: 16,
    fontWeight: "500",
  },
  sizeSelected: {
    color: theme.color.selected,
    fontWeight: "700",
  },
});
