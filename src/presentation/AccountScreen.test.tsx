import { screen } from "@testing-library/react-native";

import { AccountScreenContainer } from "@/presentation/AccountScreenContainer";
import { installFakeServices, renderWithStore } from "@/test/renderWithStore";

describe("account screen", () => {
  it("shows the mapped character name and status", async () => {
    installFakeServices();
    await renderWithStore(<AccountScreenContainer />);

    expect(await screen.findByTestId("account-name")).toBeTruthy();
    expect(screen.getByText("Rick Sanchez")).toBeTruthy();
    expect(screen.getByText("Alive")).toBeTruthy();
  });

  it("shows retry and does not render a name when the request fails", async () => {
    installFakeServices({ account: { alwaysFail: true } });
    await renderWithStore(<AccountScreenContainer />);

    expect(await screen.findByTestId("account-retry")).toBeTruthy();
    expect(screen.queryByTestId("account-name")).toBeNull();
    expect(screen.queryByText("Rick Sanchez")).toBeNull();
  });
});
