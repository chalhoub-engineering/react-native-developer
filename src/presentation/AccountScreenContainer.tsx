import { useRouter } from "expo-router";

import { useGetProfileQuery } from "@/infrastructure/http/accountApi";
import { AccountScreen } from "@/presentation/AccountScreen";

export function AccountScreenContainer() {
  const router = useRouter();
  const profileQuery = useGetProfileQuery();

  return (
    <AccountScreen
      isError={profileQuery.isError}
      isFetching={profileQuery.isFetching}
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }
        router.replace("/");
      }}
      onRetry={() => profileQuery.refetch()}
      profile={profileQuery.data}
    />
  );
}
