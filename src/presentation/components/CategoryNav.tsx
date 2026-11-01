import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Category } from "@/domain/product";
import { theme } from "@/presentation/theme";

type CategoryNavProps = {
  categories: readonly Category[];
  selected: Category;
  onSelect: (category: Category) => void;
};

export function CategoryNav({ categories, selected, onSelect }: CategoryNavProps) {
  return (
    <View style={styles.row}>
      {categories.map((category) => {
        const isSelected = category === selected;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={category}
            onPress={() => onSelect(category)}
            testID={`category-${category}`}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{category}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  label: {
    color: theme.color.text,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  labelSelected: {
    fontWeight: "700",
    borderBottomColor: theme.color.text,
  },
});
