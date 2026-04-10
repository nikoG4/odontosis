import { randomBytes } from "node:crypto";

export function createId(prefix = "") {
  return `${prefix}${randomBytes(12).toString("hex")}`;
}

export function toDbBool(value: boolean | undefined | null) {
  return value ? 1 : 0;
}

export function fromDbBool(value: unknown) {
  return Number(value) === 1;
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

export function serializeJson(value: unknown) {
  return JSON.stringify(value ?? {});
}
