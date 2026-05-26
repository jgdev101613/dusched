import type { UserRole } from "../db/schema.js";

const VALID: readonly UserRole[] = [
  "professor",
  "student",
  "admin",
  "instructor",
];

export function parseRole(value: unknown) {
  if (
    typeof value === "string" &&
    (VALID as readonly string[]).includes(value)
  ) {
    return value as UserRole;
  }
  return "user";
}

export function isAdmin(role: UserRole) {
  return role === "admin";
}

export function isStaff(role: UserRole) {
  return role === "professor" || role === "instructor";
}
