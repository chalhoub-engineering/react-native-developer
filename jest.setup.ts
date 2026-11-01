import { cleanup } from "@testing-library/react-native";

global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(Date.now());
  return 0;
};

afterEach(async () => {
  await cleanup();
});

jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Image: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  Stack: ({ children }: { children: unknown }) => children,
}));
