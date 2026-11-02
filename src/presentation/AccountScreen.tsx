import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AccountProfile } from "@/domain/account";
import { CatalogFallback } from "@/presentation/components/CatalogFallback";
import { theme } from "@/presentation/theme";

type AccountScreenProps = {
  profile: AccountProfile | undefined;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
  onBack: () => void;
};

export function AccountScreen({ profile, isError, isFetching, onRetry, onBack }: AccountScreenProps) {
  return (
    <View style={styles.page}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" onPress={onBack} testID="account-back">
            <Text style={styles.back}>Back</Text>
          </Pressable>
          <Text style={styles.heading}>My account</Text>
          <View style={styles.topSpacer} />
        </View>
        {!profile ? (
          isError && !isFetching ? (
            <CatalogFallback
              message="The account could not be loaded."
              mode="error"
              onRetry={onRetry}
              retryTestID="account-retry"
            />
          ) : (
            <CatalogFallback />
          )
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.signedIn}>Signed in</Text>
            <Image contentFit="cover" source={{ uri: profile.image }} style={styles.avatar} />
            <Text style={styles.name} testID="account-name">
              {profile.name}
            </Text>
            <ProfileRow label="Status" value={profile.status} />
            <ProfileRow label="Species" value={profile.species} />
            <ProfileRow label="Gender" value={profile.gender} />
            <ProfileRow label="Origin" value={profile.origin} />
            <ProfileRow label="Location" value={profile.location} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.color.background,
    flex: 1,
  },
  safe: {
    alignSelf: "center",
    flex: 1,
    maxWidth: 480,
    width: "100%",
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: theme.space.screen,
    paddingVertical: 12,
  },
  back: {
    color: theme.color.text,
    fontSize: 14,
    fontWeight: "600",
  },
  heading: {
    color: theme.color.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  topSpacer: {
    width: 36,
  },
  content: {
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: theme.space.screen,
  },
  signedIn: {
    color: theme.color.muted,
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  avatar: {
    backgroundColor: theme.color.panel,
    height: 140,
    width: 140,
  },
  name: {
    color: theme.color.text,
    fontSize: 22,
    fontWeight: "600",
    marginTop: 16,
  },
  row: {
    borderTopColor: theme.color.line,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    width: "100%",
  },
  label: {
    color: theme.color.muted,
    fontSize: 14,
  },
  value: {
    color: theme.color.text,
    fontSize: 14,
    fontWeight: "500",
  },
});
