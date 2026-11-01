import { it, expect } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import path from "node:path";
import { resolvePathWithinRepository } from "./path-security";

it("accepts existing paths within the repository", () => {
  expect(resolvePathWithinRepository("package.json")).toBe(
    fs.realpathSync(path.resolve("package.json")),
  );
});

it("rejects paths outside the repository", () => {
  const outsideDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "application-platform-path-test-"),
  );

  try {
    expect(() => resolvePathWithinRepository(outsideDirectory)).toThrow(
      /Path must stay within the repository/,
    );
  } finally {
    fs.rmSync(outsideDirectory, { recursive: true });
  }
});

it("rejects repository symlinks that point outside the repository", () => {
  const outsideDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "application-platform-path-test-"),
  );
  const symlinkPath = path.join(
    process.cwd(),
    `.path-security-test-${process.pid}`,
  );

  try {
    fs.symlinkSync(outsideDirectory, symlinkPath, "dir");
    expect(() => resolvePathWithinRepository(symlinkPath)).toThrow(
      /Path must stay within the repository/,
    );
  } finally {
    fs.rmSync(symlinkPath, { force: true });
    fs.rmSync(outsideDirectory, { recursive: true });
  }
});
