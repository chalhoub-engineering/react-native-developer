import { createApi } from "@reduxjs/toolkit/query/react";

import type { Catalog } from "@/domain/product";
import { mapCatalog } from "@/infrastructure/catalog/mapCatalog";
import { getServices } from "@/infrastructure/http/services";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: (args, api, extraOptions) => getServices().catalogBaseQuery(args, api, extraOptions),
  endpoints: (build) => ({
    getCatalog: build.query<Catalog, void>({
      queryFn: async (_argument, _api, _extraOptions, baseQuery) => {
        const url = process.env.EXPO_PUBLIC_CATALOG_URL?.trim() ?? "";
        if (!url) {
          return {
            error: { status: "CUSTOM_ERROR", error: "EXPO_PUBLIC_CATALOG_URL is not set" },
          };
        }
        const result = await baseQuery(url);
        if (result.error) {
          return { error: result.error };
        }
        try {
          return { data: mapCatalog(result.data) };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Invalid catalog";
          return { error: { status: "CUSTOM_ERROR", error: message } };
        }
      },
    }),
  }),
});

export const { useGetCatalogQuery } = catalogApi;
