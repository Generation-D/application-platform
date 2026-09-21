import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import path from "path";
import * as fs from "node:fs";
import { parseArgs } from "node:util";
import { marked } from "marked";
import { getSupabase } from "./utils";
import { resolvePathWithinRepository } from "./path-security";

function getAllMarkdownFiles(dirPath: string, base: string = ""): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = base ? path.join(base, entry.name) : entry.name;
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath, relPath));
    } else if (entry.isFile() && path.extname(entry.name) === ".md") {
      files.push(relPath.split(path.sep).join("/"));
    }
  }

  return files;
}

function markdownToHtml(mdText: string): string {
  return marked.parse(mdText) as string;
}

async function syncTexts(
  supabase: SupabaseClient<Database>,
  markdownFilesPath: string,
): Promise<void> {
  const baseDir = resolvePathWithinRepository(markdownFilesPath);
  const markdownFiles = getAllMarkdownFiles(baseDir);

  if (markdownFiles.length === 0) {
    console.log(
      `⚠️  No Markdown files found in ${baseDir}. Nothing to upload.`,
    );
    return;
  }

  // Clear existing records where id != 0
  const { error: deleteError } = await supabase
    .from("phase_texts")
    .delete()
    .neq("id", 0);

  if (deleteError) {
    console.error(
      `❌ Failed to clear existing records: ${deleteError.message}`,
    );
    return;
  }

  for (const relPath of markdownFiles) {
    const fullPath = path.join(baseDir, relPath);
    const mdContent = fs.readFileSync(fullPath, "utf-8");
    const htmlContent = markdownToHtml(mdContent);

    try {
      const { data, error } = await supabase
        .from("phase_texts")
        .upsert({ path: relPath, html_content: htmlContent })
        .select();

      if (error) throw error;

      console.log(`✅ Uploaded ${relPath} (${data ? data.length : 0} row(s))`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`❌ Failed to upload ${relPath}: ${message}`);
    }
  }

  console.log("✅ All markdown files uploaded to Supabase");
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

  await syncTexts(supabase, filePath);
})().catch((e) => console.error(e));
