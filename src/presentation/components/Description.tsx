import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/presentation/theme";

type DescriptionProps = {
  summary: string;
  details: readonly string[];
};

export function Description({ summary, details }: DescriptionProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.heading}>DESCRIPTION</Text>
      <Text style={styles.summary}>{summary}</Text>
      {details.map((line, index) => (
        <Text key={`${index}-${line}`} style={styles.detail}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 28,
  },
  heading: {
    color: theme.color.muted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  summary: {
    color: theme.color.body,
    fontSize: 15,
    lineHeight: 22,
  },
  detail: {
    color: theme.color.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },
});
