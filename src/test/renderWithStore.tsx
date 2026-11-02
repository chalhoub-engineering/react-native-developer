import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { cleanup, render } from "@testing-library/react-native";

import type { AppBaseQuery } from "@/infrastructure/http/services";
import { configureServices, resetServices } from "@/infrastructure/http/services";
import { catalogFixture } from "@/infrastructure/fixture/catalogFixture";
import { createAppStore } from "@/store/store";

export const characterPayload = {
  name: "Rick Sanchez",
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  status: "Alive",
  species: "Human",
  gender: "Male",
  origin: { name: "Earth (C-137)" },
  location: { name: "Citadel of Ricks" },
};

type FakeEndpoint = {
  data?: unknown;
  sequence?: readonly unknown[];
  failures?: number;
  alwaysFail?: boolean;
  shouldFail?: () => boolean;
};

function fakeQuery(endpoint: FakeEndpoint | undefined, fallback: unknown, calls: { count: number }): AppBaseQuery {
  return () => {
    calls.count += 1;
    const shouldFail =
      endpoint?.shouldFail?.() === true ||
      endpoint?.alwaysFail === true ||
      (endpoint?.failures !== undefined && calls.count <= endpoint.failures);
    if (shouldFail) {
      return { error: { status: 500, data: "failed" } };
    }
    if (endpoint?.sequence && endpoint.sequence.length > 0) {
      const index = Math.min(calls.count - 1, endpoint.sequence.length - 1);
      return { data: endpoint.sequence[index] };
    }
    return { data: endpoint?.data ?? fallback };
  };
}

export function installFakeServices(options?: { catalog?: FakeEndpoint; account?: FakeEndpoint }) {
  resetServices();
  const catalogCalls = { count: 0 };
  const accountCalls = { count: 0 };
  configureServices({
    catalogBaseQuery: fakeQuery(options?.catalog, catalogFixture, catalogCalls),
    accountBaseQuery: fakeQuery(options?.account, characterPayload, accountCalls),
  });
  return {
    catalogCalls: () => catalogCalls.count,
    accountCalls: () => accountCalls.count,
  };
}

export async function renderWithStore(ui: ReactElement) {
  await cleanup();
  const store = createAppStore();
  const view = await render(<Provider store={store}>{ui}</Provider>);
  return { store, ...view };
}
