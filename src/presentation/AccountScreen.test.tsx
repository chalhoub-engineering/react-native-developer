import { fireEvent, screen } from "@testing-library/react-native";

import { AccountScreenContainer } from "@/presentation/AccountScreenContainer";
import { installFakeServices, renderWithStore } from "@/test/renderWithStore";
import { routerMock } from "@/test/routerMock";

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

  it("goes back when the account screen was opened from the catalog", async () => {
    installFakeServices();
    await renderWithStore(<AccountScreenContainer />);
    await screen.findByTestId("account-back");

    await fireEvent.press(screen.getByTestId("account-back"));

    expect(routerMock.back).toHaveBeenCalledTimes(1);
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  it("opens the catalog when account was entered directly", async () => {
    routerMock.canGoBack.mockReturnValue(false);
    installFakeServices();
    await renderWithStore(<AccountScreenContainer />);
    await screen.findByTestId("account-back");

    await fireEvent.press(screen.getByTestId("account-back"));

    expect(routerMock.replace).toHaveBeenCalledWith("/");
    expect(routerMock.back).not.toHaveBeenCalled();
  });
});
