#!/usr/bin/env node

/**
 * Aggressive tracking removal for minified HTML files
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

async function aggressiveClean(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Remove GA4/GTM URLs array
  content = content.replace(
    /var\s+urls\s*=\s*\[\s*['"]https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-WT6N5R6W6Z['"],?\s*['"]https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=['"][^"']*['"],?\s*\]/g,
    'var urls = []'
  );

  // Remove entire GTM/AdSense initialization function
  content = content.replace(
    /\(function\s*\(\)\s*\{[\s\S]*?googletagmanager\.com[\s\S]*?googlesyndication\.com[\s\S]*?\}\)\(\);?/g,
    ''
  );

  // Remove any remaining gtag references
  content = content.replace(/G-WT6N5R6W6Z/g, '');
  content = content.replace(/ca-pub-3558414621046573/g, '');
  content = content.replace(/googletagmanager\.com/g, '');
  content = content.replace(/googlesyndication\.com/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { modified: true, file: path.relative(ROOT_DIR, filePath) };
  }

  return { modified: false };
}

async function main() {
  console.log('🧹 Aggressive cleanup of minified HTML files...\n');

  // Find all nested HTML files
  const htmlFiles = await glob('**/index.html', {
    cwd: ROOT_DIR,
    ignore: ['node_modules/**', 'dist/**', '.legacy/**', '.git/**'],
    absolute: true
  });

  console.log(`Found ${htmlFiles.length} nested HTML files\n`);

  let cleaned = 0;
  for (const file of htmlFiles) {
    const result = await aggressiveClean(file);
    if (result.modified) {
      cleaned++;
      console.log(`✓ Cleaned: ${result.file}`);
    }
  }

  console.log(`\n✨ Cleaned ${cleaned} files`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
