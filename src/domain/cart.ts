import type { Size } from "@/domain/product";

export type CartLine = {
  productId: string;
  size: Size;
  colorId: string;
  quantity: number;
};

export type CartDraft = Omit<CartLine, "quantity">;

export function addLine(lines: readonly CartLine[], draft: CartDraft): CartLine[] {
  const index = lines.findIndex(
    (line) =>
      line.productId === draft.productId &&
      line.size === draft.size &&
      line.colorId === draft.colorId,
  );
  if (index === -1) {
    return [...lines, { ...draft, quantity: 1 }];
  }
  return lines.map((line, lineIndex) =>
    lineIndex === index ? { ...line, quantity: line.quantity + 1 } : line,
  );
}

export function cartCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
