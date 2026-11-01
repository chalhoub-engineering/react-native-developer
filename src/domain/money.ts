export type Money = {
  amount: number;
  currency: string;
};

export function formatPrice(money: Money): string {
  return `${money.currency} ${money.amount}`;
}
