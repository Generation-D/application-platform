import { it, expect } from "vitest";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { PhasesConfigSchema } from "./phasesConfigSchema";

it("the current Generation-D phase configuration is importable", () => {
  const configPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../apl_configs/apl_config_gend_all_phases.yml",
  );
  const config = PhasesConfigSchema.parse(
    YAML.parse(fs.readFileSync(configPath, "utf-8")),
  );

  expect(config.questions["phase-1"].phaseLabel).toBe("Kurzbewerbung");
  expect(config.questions["phase-2"].phaseLabel).toBe("Read-Deck");
});
