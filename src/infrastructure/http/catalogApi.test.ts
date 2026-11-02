import { catalogApi } from "@/infrastructure/http/catalogApi";
import { catalogFixture } from "@/infrastructure/fixture/catalogFixture";
import { installFakeServices } from "@/test/renderWithStore";
import { createAppStore } from "@/store/store";

describe("getCatalog", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("stores the mapped catalog when the request succeeds", async () => {
    jest.useFakeTimers();
    installFakeServices();
    const store = createAppStore();
    const request = store.dispatch(catalogApi.endpoints.getCatalog.initiate());
    await jest.runAllTimersAsync();
    await request;
    const result = catalogApi.endpoints.getCatalog.select()(store.getState());
    expect(result.data?.product).toEqual(catalogFixture.product);
    expect(result.data?.relatedProducts).toHaveLength(4);
    request.unsubscribe();
    store.dispatch(catalogApi.util.resetApiState());
    await jest.runOnlyPendingTimersAsync();
  });

  it("exposes an error and leaves the screen data empty when the request fails", async () => {
    jest.useFakeTimers();
    installFakeServices({ catalog: { alwaysFail: true } });
    const store = createAppStore();
    const request = store.dispatch(catalogApi.endpoints.getCatalog.initiate());
    await jest.runAllTimersAsync();
    await request;
    const result = catalogApi.endpoints.getCatalog.select()(store.getState());
    expect(result.error).toBeDefined();
    expect(result.data).toBeUndefined();
    request.unsubscribe();
    store.dispatch(catalogApi.util.resetApiState());
    await jest.runOnlyPendingTimersAsync();
  });

  it("reports a configuration error and does not call the client when the catalog URL is blank", async () => {
    jest.useFakeTimers();
    const previous = process.env.EXPO_PUBLIC_CATALOG_URL;
    process.env.EXPO_PUBLIC_CATALOG_URL = " ";
    const calls = installFakeServices();
    const store = createAppStore();
    const request = store.dispatch(catalogApi.endpoints.getCatalog.initiate());
    await jest.runAllTimersAsync();
    await request;
    const result = catalogApi.endpoints.getCatalog.select()(store.getState());
    expect(result.error).toEqual({
      status: "CUSTOM_ERROR",
      error: "EXPO_PUBLIC_CATALOG_URL is not set",
    });
    expect(result.data).toBeUndefined();
    expect(calls.catalogCalls()).toBe(0);
    request.unsubscribe();
    store.dispatch(catalogApi.util.resetApiState());
    process.env.EXPO_PUBLIC_CATALOG_URL = previous;
    await jest.runOnlyPendingTimersAsync();
  });

  it("turns a malformed catalog into a query error", async () => {
    jest.useFakeTimers();
    installFakeServices({ catalog: { data: { product: {} } } });
    const store = createAppStore();
    const request = store.dispatch(catalogApi.endpoints.getCatalog.initiate());
    await jest.runAllTimersAsync();
    await request;
    const result = catalogApi.endpoints.getCatalog.select()(store.getState());
    expect(result.error).toMatchObject({ status: "CUSTOM_ERROR" });
    expect(result.data).toBeUndefined();
    request.unsubscribe();
    store.dispatch(catalogApi.util.resetApiState());
    await jest.runOnlyPendingTimersAsync();
  });
});
