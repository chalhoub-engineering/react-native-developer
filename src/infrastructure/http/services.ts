import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

export type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

type Services = {
  catalogBaseQuery: AppBaseQuery;
  accountBaseQuery: AppBaseQuery;
};

const REQUEST_TIMEOUT_MS = 15_000;
const TRANSIENT_STATUS = new Set([408, 429, 500, 502, 503, 504]);

function isTransient(error: FetchBaseQueryError): boolean {
  if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") {
    return true;
  }
  return typeof error.status === "number" && TRANSIENT_STATUS.has(error.status);
}

function withRetries(base: AppBaseQuery, retries = 2): AppBaseQuery {
  return async (args, api, extraOptions) => {
    let result = await base(args, api, extraOptions);
    let remaining = retries;
    while (result.error && isTransient(result.error) && remaining > 0) {
      remaining -= 1;
      result = await base(args, api, extraOptions);
    }
    return result;
  };
}

function createDefaultServices(): Services {
  const timed = { baseUrl: "", timeout: REQUEST_TIMEOUT_MS };
  return {
    catalogBaseQuery: withRetries(fetchBaseQuery(timed)),
    accountBaseQuery: fetchBaseQuery(timed),
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
