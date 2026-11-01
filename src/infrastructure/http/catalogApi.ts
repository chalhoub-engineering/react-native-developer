import { createApi } from "@reduxjs/toolkit/query/react";

import type { Catalog } from "@/domain/product";
import { mapCatalog } from "@/infrastructure/catalog/mapCatalog";
import { getServices } from "@/infrastructure/http/services";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: (args, api, extraOptions) => getServices().catalogBaseQuery(args, api, extraOptions),
  endpoints: (build) => ({
    getCatalog: build.query<Catalog, void>({
      query: () => process.env.EXPO_PUBLIC_CATALOG_URL ?? "",
      transformResponse: (response: unknown) => mapCatalog(response),
    }),
  }),
});

export const { useGetCatalogQuery } = catalogApi;
