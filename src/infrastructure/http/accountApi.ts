import { createApi } from "@reduxjs/toolkit/query/react";

import type { AccountProfile } from "@/domain/account";
import { mapCharacter } from "@/infrastructure/account/mapCharacter";
import { getServices } from "@/infrastructure/http/services";

export const CHARACTER_URL = "https://rickandmortyapi.com/api/character/1";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: (args, api, extraOptions) => getServices().accountBaseQuery(args, api, extraOptions),
  endpoints: (build) => ({
    getProfile: build.query<AccountProfile, void>({
      query: () => CHARACTER_URL,
      transformResponse: (response: unknown) => mapCharacter(response),
    }),
  }),
});

export const { useGetProfileQuery } = accountApi;
