import markdownToHtml from '../src/utils/markdownToHtml';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const baseDir = path.join(process.cwd(), 'public', 'texts');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function getAllMarkdownFiles(dir: string, base = ''): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);
    if (entry.isDirectory()) {
      return getAllMarkdownFiles(fullPath, relPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      return [relPath];
    } else {
      return [];
    }
  });
}

async function buildTextMap() {
  const markdownFiles = getAllMarkdownFiles(baseDir);

  await supabase.from('phase_texts').delete().neq('id', 0);

  for (const relPath of markdownFiles) {
    const fullPath = path.join(baseDir, relPath);
    const markdown = fs.readFileSync(fullPath, 'utf8');
    const html = await markdownToHtml(markdown);

    const { error } = await supabase
      .from('phase_texts')
      .upsert({ path: relPath, html_content: html });

    if (error) {
      console.error(`❌ Failed to upload ${relPath}:`, error.message);
    } else {
      console.log(`✅ Uploaded ${relPath}`);
    }
  }

  console.log('✅ All markdown files uploaded to Supabase');
}

buildTextMap();
