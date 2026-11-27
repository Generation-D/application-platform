import { expect, it } from "vitest";

import { safeRelativePath } from "@/utils/helpers";

it("keeps plain relative paths", () => {
  expect(safeRelativePath("login/update-password")).toBe(
    "login/update-password",
  );
  expect(safeRelativePath("/review")).toBe("review");
});

it("returns an empty path for missing values", () => {
  expect(safeRelativePath(null)).toBe("");
  expect(safeRelativePath("")).toBe("");
});

it("rejects anything that could change the host", () => {
  for (const next of [
    "//evil.example",
    "https://evil.example",
    "@evil.example",
    ".evil.example",
    "login?x=1",
    "a\\b",
  ]) {
    expect(safeRelativePath(next)).not.toContain("evil");
  }
  expect(safeRelativePath("//evil.example")).toBe("");
});
