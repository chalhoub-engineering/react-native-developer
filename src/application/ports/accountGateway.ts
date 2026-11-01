import type { AccountProfile } from "@/domain/account";

export interface AccountGateway {
  getProfile(): Promise<AccountProfile>;
}
