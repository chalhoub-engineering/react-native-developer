import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/presentation/theme";

type AddToBagButtonProps = {
  count: number;
  disabled: boolean;
  onPress: () => void;
};

export function AddToBagButton({ count, disabled, onPress }: AddToBagButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
      testID="add-to-bag"
    >
      <Text style={styles.label}>ADD TO BAG</Text>
      <Text style={styles.count} testID="cart-count">
        {count}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: theme.color.button,
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
    marginTop: 22,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: "#8a8a8a",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  count: {
    color: theme.color.text,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
  },
});
