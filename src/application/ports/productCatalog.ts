import type { Catalog } from "@/domain/product";

export interface ProductCatalog {
  getCatalog(): Promise<Catalog>;
}
