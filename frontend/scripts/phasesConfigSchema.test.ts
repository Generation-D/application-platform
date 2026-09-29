import assert from "node:assert/strict";
import * as fs from "node:fs";
import test from "node:test";
import YAML from "yaml";
import { PhasesConfigSchema } from "./phasesConfigSchema";

test("validates config correct", () => {
  const fileContent = fs.readFileSync(
    "../apl_configs/apl_config_gend_all_phases.yml",
    "utf-8",
  );

  const rawData = YAML.parse(fileContent);

  assert.doesNotThrow(() => {
    PhasesConfigSchema.parse(rawData);
  });
});

test("validates config2 correct", () => {
  const fileContent = fs.readFileSync("../apl_configs/apl_config.yml", "utf-8");

  const rawData = YAML.parse(fileContent);

  assert.doesNotThrow(() => {
    PhasesConfigSchema.parse(rawData);
  });
});
