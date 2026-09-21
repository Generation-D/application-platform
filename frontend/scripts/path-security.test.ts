import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import path from "node:path";
import test from "node:test";
import { resolvePathWithinRepository } from "./path-security";

test("accepts existing paths within the repository", () => {
  assert.equal(
    resolvePathWithinRepository("package.json"),
    fs.realpathSync(path.resolve("package.json")),
  );
});

test("rejects paths outside the repository", () => {
  const outsideDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "application-platform-path-test-"),
  );

  try {
    assert.throws(
      () => resolvePathWithinRepository(outsideDirectory),
      /Path must stay within the repository/,
    );
  } finally {
    fs.rmSync(outsideDirectory, { recursive: true });
  }
});

test("rejects repository symlinks that point outside the repository", () => {
  const outsideDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "application-platform-path-test-"),
  );
  const symlinkPath = path.join(
    process.cwd(),
    `.path-security-test-${process.pid}`,
  );

  try {
    fs.symlinkSync(outsideDirectory, symlinkPath, "dir");
    assert.throws(
      () => resolvePathWithinRepository(symlinkPath),
      /Path must stay within the repository/,
    );
  } finally {
    fs.rmSync(symlinkPath, { force: true });
    fs.rmSync(outsideDirectory, { recursive: true });
  }
});
