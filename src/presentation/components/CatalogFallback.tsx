import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/presentation/theme";

type CatalogFallbackProps = {
  mode?: "loading" | "error";
  onRetry?: () => void;
  message?: string;
  retryTestID?: string;
};

export function CatalogFallback({
  mode = "loading",
  onRetry,
  message = "The catalog could not be loaded.",
  retryTestID = "catalog-retry",
}: CatalogFallbackProps) {
  const isError = mode === "error";
  return (
    <View style={styles.page} testID={isError ? "catalog-error" : "catalog-loading"}>
      {isError ? (
        <>
          <Text style={styles.message}>{message}</Text>
          <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button} testID={retryTestID}>
            <Text style={styles.buttonLabel}>Retry</Text>
          </Pressable>
        </>
      ) : (
        <ActivityIndicator color={theme.color.text} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    backgroundColor: theme.color.background,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  message: {
    color: theme.color.text,
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.color.button,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonLabel: {
    color: theme.color.text,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.6,
  },
});
