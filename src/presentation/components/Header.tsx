import { Pressable, StyleSheet, Text, View } from "react-native";

import { Logo } from "@/presentation/components/Logo";
import { theme } from "@/presentation/theme";

type HeaderProps = {
  onLogoPress: () => void;
  onAccountPress: () => void;
};

export function Header({ onLogoPress, onAccountPress }: HeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.side} />
      <Logo onPress={onLogoPress} />
      <Pressable
        accessibilityRole="button"
        onPress={onAccountPress}
        style={styles.side}
        testID="open-account"
      >
        <Text style={styles.account}>Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 8,
  },
  side: {
    alignItems: "flex-end",
    flex: 1,
  },
  account: {
    color: theme.color.text,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});
