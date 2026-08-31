import assert from "node:assert/strict";
import * as fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { PhasesConfigSchema } from "./phasesConfigSchema";

test("the current Generation-D phase configuration is importable", () => {
  const configPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../apl_configs/apl_config_gend_all_phases.yml",
  );
  const config = PhasesConfigSchema.parse(
    YAML.parse(fs.readFileSync(configPath, "utf-8")),
  );

  assert.equal(config.questions["phase-1"].phaseLabel, "Kurzbewerbung");
  assert.equal(config.questions["phase-2"].phaseLabel, "Read-Deck");
});
