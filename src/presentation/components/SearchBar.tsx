import { StyleSheet, TextInput, View } from "react-native";

import { theme } from "@/presentation/theme";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View style={styles.field}>
      <TextInput
        accessibilityLabel="Search products"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChange}
        placeholder="SEARCH"
        placeholderTextColor={theme.color.placeholder}
        style={styles.input}
        testID="search-input"
        value={value}
      />
      <SearchIcon />
    </View>
  );
}

function SearchIcon() {
  return (
    <View style={styles.icon}>
      <View style={styles.lens} />
      <View style={styles.handle} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    alignItems: "center",
    borderColor: "#dedede",
    borderWidth: 1,
    flexDirection: "row",
    height: 42,
    marginBottom: 18,
    paddingHorizontal: 12,
  },
  input: {
    color: theme.color.text,
    flex: 1,
    fontSize: 13,
    letterSpacing: 1.4,
    padding: 0,
  },
  icon: {
    height: 16,
    width: 16,
  },
  lens: {
    borderColor: theme.color.muted,
    borderRadius: 7,
    borderWidth: 1.5,
    height: 11,
    width: 11,
  },
  handle: {
    backgroundColor: theme.color.muted,
    height: 6,
    left: 9,
    position: "absolute",
    top: 9,
    transform: [{ rotate: "45deg" }],
    width: 1.5,
  },
});
