/** Major-unit amount, such as 250 AED. No minor-unit conversion or arithmetic is applied. */
export type Money = {
  amount: number;
  currency: string;
};

export function formatPrice(money: Money): string {
  return `${money.currency} ${money.amount}`;
}
