#!/usr/bin/env node

/**
 * Final pass - remove ALL tracking code from ALL HTML files
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

async function finalClean(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Remove the entire tracking initialization block
  content = content.replace(
    /<script>var delayScripts[\s\S]*?<\/script>/g,
    ''
  );

  // Remove any remaining tracking URLs
  content = content.replace(/G-WT6N5R6W6Z/g, '');
  content = content.replace(/ca-pub-3558414621046573/g, '');
  content = content.replace(/googletagmanager\.com[^"']*/g, '');
  content = content.replace(/googlesyndication\.com[^"']*/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { modified: true, file: path.relative(ROOT_DIR, filePath) };
  }

  return { modified: false };
}

async function main() {
  console.log('🧹 Final cleanup pass on ALL HTML files...\n');

  const htmlFiles = await glob('**/*.html', {
    cwd: ROOT_DIR,
    ignore: ['node_modules/**', 'dist/**', '.legacy/**', '.git/**', '.npm-cache/**'],
    absolute: true
  });

  console.log(`Found ${htmlFiles.length} HTML files\n`);

  let cleaned = 0;
  for (const file of htmlFiles) {
    const result = await finalClean(file);
    if (result.modified) {
      cleaned++;
      console.log(`✓ ${result.file}`);
    }
  }

  console.log(`\n✨ Final pass: ${cleaned} files cleaned`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
