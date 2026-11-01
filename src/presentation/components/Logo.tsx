import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/presentation/theme";

type LogoProps = {
  onPress: () => void;
};

export function Logo({ onPress }: LogoProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.hit} testID="logo">
      <Text style={styles.wordmark}>LOGO</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignItems: "center",
    paddingVertical: 8,
  },
  wordmark: {
    color: theme.color.text,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
});
