export type CatalogPriceDto = {
  amount: number;
  currency: string;
};

export type CatalogColorDto = {
  id: string;
  name: string;
  hex: string;
};

export type CatalogProductDto = {
  id: string;
  title: string;
  price: CatalogPriceDto;
  imageUrl: string;
  category: string;
  sizes: string[];
  colors: CatalogColorDto[];
  description: {
    summary: string;
    details: string[];
  };
};

export type RelatedProductDto = {
  id?: string;
  imageUrl: string;
  title?: string;
};

export type CatalogDto = {
  product: CatalogProductDto;
  relatedProducts: RelatedProductDto[];
};
