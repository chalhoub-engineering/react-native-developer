import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ColorOption } from "@/domain/product";
import { theme } from "@/presentation/theme";

type ColorSelectorProps = {
  colors: readonly ColorOption[];
  selectedId: string | null;
  onSelect: (colorId: string) => void;
};

export function ColorSelector({ colors, selectedId, onSelect }: ColorSelectorProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>Colors:</Text>
      <View style={styles.row}>
        {colors.map((color) => {
          const isSelected = color.id === selectedId;
          return (
            <Pressable
              accessibilityLabel={color.name}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={color.id}
              onPress={() => onSelect(color.id)}
              testID={`color-${color.id}`}
            >
              <View style={[styles.ring, isSelected && styles.ringSelected]}>
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: color.hex },
                    color.hex.toLowerCase() === "#ffffff" && styles.lightSwatch,
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 22,
  },
  label: {
    color: theme.color.muted,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  ring: {
    borderColor: "transparent",
    borderWidth: 1,
    padding: 3,
  },
  ringSelected: {
    borderColor: theme.color.selected,
  },
  swatch: {
    height: 28,
    width: 28,
  },
  lightSwatch: {
    borderColor: "#e4e4e4",
    borderWidth: 1,
  },
});
