import type { UserRole } from "../db/schema.js";

const VALID: readonly UserRole[] = [
  "admin",
  "student",
  "professor",
  "instructor",
  "newcomer",
];

export function parseRole(value: unknown) {
  if (
    typeof value === "string" &&
    (VALID as readonly string[]).includes(value)
  ) {
    return value as UserRole;
  }
  return "newcomer";
}

export function isAdmin(role: UserRole) {
  return role === "admin";
}

export function isStaff(role: UserRole) {
  return role === "professor" || role === "instructor";
}
