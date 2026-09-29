import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fs.realpathSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
);

export function resolvePathWithinRepository(inputPath: string): string {
  const resolvedPath = fs.realpathSync(path.resolve(inputPath));
  const relativePath = path.relative(repositoryRoot, resolvedPath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`Path must stay within the repository: ${inputPath}`);
  }

  return resolvedPath;
}
