import { cleanup } from "@testing-library/react-native";

import { routerMock } from "./src/test/routerMock";

process.env.EXPO_PUBLIC_CATALOG_URL = "https://example.com/catalog.json";

globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(Date.now());
  return 0;
};

afterEach(async () => {
  await cleanup();
  routerMock.push.mockClear();
  routerMock.back.mockClear();
  routerMock.replace.mockClear();
  routerMock.canGoBack.mockReset();
  routerMock.canGoBack.mockReturnValue(true);
});

jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Image: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});

jest.mock("expo-router", () => {
  const { routerMock: router } = require("./src/test/routerMock");
  return {
    useRouter: () => router,
    Stack: ({ children }: { children: unknown }) => children,
  };
});
