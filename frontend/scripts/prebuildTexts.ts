import markdownToHtml from '../src/utils/markdownToHtml';
import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'public', 'texts');

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
  const result: Record<string, string> = {};
  const markdownFiles = getAllMarkdownFiles(baseDir);

  for (const relPath of markdownFiles) {
    const fullPath = path.join(baseDir, relPath);
    const markdown = fs.readFileSync(fullPath, 'utf8');
    const html = await markdownToHtml(markdown);
    result[relPath] = html;
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'src', 'generated', 'textCache.ts'),
    'export const textCache = ' + JSON.stringify(result, null, 2),
  );
}

buildTextMap();
