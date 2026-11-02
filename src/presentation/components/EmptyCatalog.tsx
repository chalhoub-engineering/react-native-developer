import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/presentation/theme";

export function EmptyCatalog() {
  return (
    <View style={styles.box} testID="empty-catalog">
      <Text style={styles.message}>No products in this category.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    paddingVertical: 72,
  },
  message: {
    color: theme.color.muted,
    fontSize: 16,
  },
});
