import type { AccountProfile } from "@/domain/account";

export class AccountMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccountMappingError";
  }
}

export function mapCharacter(input: unknown): AccountProfile {
  const record = asRecord(input, "character");
  return {
    name: requireString(record, "name"),
    image: requireString(record, "image"),
    status: requireString(record, "status"),
    species: requireString(record, "species"),
    gender: requireString(record, "gender"),
    origin: nestedName(record.origin, "origin"),
    location: nestedName(record.location, "location"),
  };
}

function nestedName(input: unknown, label: string): string {
  const record = asRecord(input, label);
  return requireString(record, "name");
}

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new AccountMappingError(`Missing ${key}`);
  }
  return value;
}

function asRecord(input: unknown, label: string): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new AccountMappingError(`Missing ${label}`);
  }
  return input as Record<string, unknown>;
}
