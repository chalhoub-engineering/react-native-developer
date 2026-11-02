import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Provider } from "react-redux";

import { catalogFixture } from "@/infrastructure/fixture/catalogFixture";
import { catalogApi } from "@/infrastructure/http/catalogApi";
import { ProductScreenContainer } from "@/presentation/ProductScreenContainer";
import { installFakeServices, renderWithStore } from "@/test/renderWithStore";

describe("product screen", () => {
  it("shows the catalog from the fake gateway", async () => {
    installFakeServices();
    await renderWithStore(<ProductScreenContainer />);

    expect(await screen.findByText("Tiger Medium Red")).toBeTruthy();
    expect(screen.getByLabelText("Search products")).toBeTruthy();
    expect(screen.getByLabelText("Size M")).toBeTruthy();
    expect(screen.getByLabelText("Tiger Forest Green")).toBeTruthy();
    expect(screen.getByText("AED 250")).toBeTruthy();
    expect(screen.getByText("S")).toBeTruthy();
    expect(screen.getByText("M")).toBeTruthy();
    expect(screen.getByText("L")).toBeTruthy();
    expect(screen.getByText("XL")).toBeTruthy();
    expect(screen.getByTestId("color-black")).toBeTruthy();
    expect(screen.getByTestId("color-mist")).toBeTruthy();
    expect(screen.getByTestId("color-white")).toBeTruthy();
    expect(screen.getByTestId("color-forest")).toBeTruthy();
    expect(screen.getByText(/Short sleeved T-shirt/)).toBeTruthy();
    expect(screen.getByTestId("related-tiger-forest")).toBeTruthy();
    expect(screen.getByTestId("related-tiger-blue")).toBeTruthy();
    expect(screen.getByTestId("related-tiger-black")).toBeTruthy();
    expect(screen.getByTestId("related-tiger-gray")).toBeTruthy();
  });

  it("adds the selected size and color to the bag", async () => {
    installFakeServices();
    const { store } = await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");

    await fireEvent.press(screen.getByTestId("size-XL"));
    await fireEvent.press(screen.getByTestId("color-forest"));
    await fireEvent.press(screen.getByTestId("add-to-bag"));

    expect(store.getState().productUi.cart).toEqual([
      { productId: "tiger-medium-red", size: "XL", colorId: "forest", quantity: 1 },
    ]);
  });

  it("keeps spaces while typing, clearing, and pasting a search", async () => {
    installFakeServices();
    await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");
    const input = screen.getByLabelText("Search products");

    await fireEvent.changeText(input, "Tiger");
    expect(input.props.value).toBe("Tiger");
    await fireEvent.changeText(input, "Tiger ");
    expect(input.props.value).toBe("Tiger ");
    await fireEvent.changeText(input, "Tiger Light");
    expect(input.props.value).toBe("Tiger Light");
    expect(screen.getByTestId("related-tiger-blue")).toBeTruthy();

    await fireEvent.changeText(input, "");
    expect(input.props.value).toBe("");
    expect(screen.getByTestId("related-tiger-forest")).toBeTruthy();

    await fireEvent.changeText(input, "  Tiger Light Blue  ");
    expect(input.props.value).toBe("  Tiger Light Blue  ");
    expect(screen.getByTestId("related-tiger-blue")).toBeTruthy();
    expect(screen.queryByTestId("related-tiger-forest")).toBeNull();
  });

  it("drops a variant the refreshed catalog no longer sells", async () => {
    const next = structuredClone(catalogFixture);
    next.product.sizes = ["S", "M", "L"];
    next.product.colors = next.product.colors.filter((color) => color.id !== "forest");
    installFakeServices({ catalog: { sequence: [catalogFixture, next] } });
    const { store } = await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");

    await fireEvent.press(screen.getByTestId("size-XL"));
    await fireEvent.press(screen.getByTestId("color-forest"));
    await act(async () => {
      await store.dispatch(catalogApi.endpoints.getCatalog.initiate(undefined, { forceRefetch: true }));
    });

    expect(store.getState().productUi.selectedSize).toBe("M");
    expect(store.getState().productUi.selectedColorId).toBe("black");
    await fireEvent.press(screen.getByTestId("add-to-bag"));
    expect(store.getState().productUi.cart).toEqual([
      { productId: "tiger-medium-red", size: "M", colorId: "black", quantity: 1 },
    ]);
  });

  it("resets the variant when the catalog product id changes", async () => {
    const next = structuredClone(catalogFixture);
    next.product.id = "other-shirt";
    installFakeServices({ catalog: { sequence: [catalogFixture, next] } });
    const { store } = await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");

    await fireEvent.press(screen.getByTestId("size-XL"));
    await fireEvent.press(screen.getByTestId("color-forest"));
    await act(async () => {
      await store.dispatch(catalogApi.endpoints.getCatalog.initiate(undefined, { forceRefetch: true }));
    });

    expect(store.getState().productUi.selectedProductId).toBe("other-shirt");
    expect(store.getState().productUi.selectedSize).toBe("M");
    expect(store.getState().productUi.selectedColorId).toBe("black");
  });

  it("keeps a valid variant when the product screen remounts", async () => {
    installFakeServices();
    const { store, unmount } = await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");
    await fireEvent.press(screen.getByTestId("size-XL"));
    await fireEvent.press(screen.getByTestId("color-forest"));

    unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const remounted = await render(
      <Provider store={store}>
        <ProductScreenContainer />
      </Provider>,
    );

    expect(store.getState().productUi.selectedSize).toBe("XL");
    expect(store.getState().productUi.selectedColorId).toBe("forest");
    remounted.unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it("filters related products by the search text", async () => {
    installFakeServices();
    await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");

    await fireEvent.changeText(screen.getByTestId("search-input"), "blue");

    expect(screen.getByTestId("related-tiger-blue")).toBeTruthy();
    expect(screen.queryByTestId("related-tiger-forest")).toBeNull();
    expect(screen.queryByTestId("related-tiger-black")).toBeNull();
    expect(screen.queryByTestId("related-tiger-gray")).toBeNull();
  });

  it("shows an empty state for another category", async () => {
    installFakeServices();
    await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");

    await fireEvent.press(screen.getByTestId("category-KIDS"));

    expect(screen.getByTestId("empty-catalog")).toBeTruthy();
    expect(screen.queryByText("Tiger Medium Red")).toBeNull();
  });

  it("opens and closes the image lightbox", async () => {
    installFakeServices();
    await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");

    await fireEvent.press(screen.getByTestId("expand-image"));
    expect(screen.getByTestId("lightbox")).toBeTruthy();

    await fireEvent.press(screen.getByTestId("lightbox-close"));
    expect(screen.queryByTestId("lightbox")).toBeNull();
  });

  it("retries a failed catalog request", async () => {
    let fail = true;
    const calls = installFakeServices({ catalog: { shouldFail: () => fail } });
    await renderWithStore(<ProductScreenContainer />);

    expect(await screen.findByTestId("catalog-retry")).toBeTruthy();
    expect(screen.queryByText("Tiger Medium Red")).toBeNull();

    fail = false;
    await fireEvent.press(screen.getByTestId("catalog-retry"));

    expect(await screen.findByText("Tiger Medium Red")).toBeTruthy();
    expect(calls.catalogCalls()).toBe(2);
  });
});
