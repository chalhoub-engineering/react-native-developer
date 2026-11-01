import { fireEvent, screen } from "@testing-library/react-native";

import { ProductScreenContainer } from "@/presentation/ProductScreenContainer";
import { installFakeServices, renderWithStore } from "@/test/renderWithStore";

describe("product screen", () => {
  it("shows the catalog from the fake gateway", async () => {
    installFakeServices();
    await renderWithStore(<ProductScreenContainer />);

    expect(await screen.findByText("Tiger Medium Red")).toBeTruthy();
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
    await renderWithStore(<ProductScreenContainer />);
    await screen.findByText("Tiger Medium Red");

    await fireEvent.press(screen.getByTestId("size-XL"));
    await fireEvent.press(screen.getByTestId("color-forest"));
    await fireEvent.press(screen.getByTestId("add-to-bag"));

    expect(screen.getByTestId("cart-count").props.children).toBe(1);
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
