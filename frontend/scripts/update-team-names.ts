import { parseArgs } from "node:util";
import * as fs from "node:fs";
import { parse } from "csv-parse/sync";
import { getSupabase } from "./utils";

interface ApplicationRow {
  applicationid: string;
  team_name: string;
}

function readCsvFile(filePath: string): ApplicationRow[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const records: ApplicationRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records;
}

(async () => {
  const supabase = getSupabase();

  const { values, positionals } = parseArgs({
    options: {
      file: {
        type: "string",
        short: "f",
      },
    },
    allowPositionals: true,
  });

  const filePath = values.file ?? positionals[0];

  if (!filePath) {
    console.error(
      "Error: Please provide a file via '-f <file>' or as the first argument.",
    );
    return;
  }

  const records = readCsvFile(filePath);

  const updatePromises = records.map((record) =>
    supabase
      .from("application_table")
      .update({ team_name: record.team_name })
      .eq("applicationid", record.applicationid),
  );

  const results = await Promise.all(updatePromises);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.error("Some updates failed:", errors);
  }
})().catch((e) => console.error(e));;
