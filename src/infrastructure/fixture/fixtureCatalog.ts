import type { ProductCatalog } from "@/application/ports/productCatalog";
import { catalogFixture } from "@/infrastructure/fixture/catalogFixture";

export const fixtureCatalog: ProductCatalog = {
  getCatalog() {
    return Promise.resolve(catalogFixture);
  },
};
