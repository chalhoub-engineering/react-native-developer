import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

type Services = {
  catalogBaseQuery: AppBaseQuery;
  accountBaseQuery: AppBaseQuery;
};

function createDefaultServices(): Services {
  return {
    catalogBaseQuery: fetchBaseQuery({ baseUrl: "" }),
    accountBaseQuery: fetchBaseQuery({ baseUrl: "" }),
  };
}

let services: Services = createDefaultServices();

export function configureServices(next: Partial<Services>) {
  services = { ...services, ...next };
}

export function getServices(): Services {
  return services;
}

export function resetServices() {
  services = createDefaultServices();
}
