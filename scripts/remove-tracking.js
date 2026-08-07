#!/usr/bin/env node

/**
 * Remove tracking, ads, and upstream branding from HTML files
 *
 * Removes:
 * - Google Analytics (GA4: G-WT6N5R6W6Z)
 * - Google AdSense (ca-pub-3558414621046573)
 * - emn178 branding and URLs
 * - Replaces with lowcode-apps branding
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Patterns to remove
const TRACKING_PATTERNS = [
  // Google Analytics - entire script block (lines 3-49 typically)
  /window\.dataLayer[\s\S]*?gtag\('config',\s*'G-WT6N5R6W6Z'\);?/g,

  // Additional gtag calls
  /gtag\(['"]event['"],[\s\S]*?\);?/g,
  /gtag\(['"]js['"],[\s\S]*?\);?/g,

  // Google Tag Manager script
  /<script[^>]*src=["']https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-WT6N5R6W6Z["'][^>]*><\/script>/g,

  // Google AdSense
  /ca-pub-3558414621046573/g,
  /<script[^>]*src=["']https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*><\/script>/g,

  // AdSense insertion blocks
  /<ins\s+class=["']ads["'][\s\S]*?<\/ins>/g,

  // AdSense push code
  /\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\([^)]*\);?/g,

  // Lazy loading script that loads GA and AdSense (typically large script block)
  /<script>[\s\S]*?if\s*\(\s*location\.hostname\s*!=\s*['"]localhost['"][\s\S]*?<\/script>/g,
];

// URL and branding replacements
const REPLACEMENTS = [
  // URLs
  {
    from: /https:\/\/emn178\.github\.io\/online-tools/g,
    to: 'https://lowcode-apps.github.io/online-tools'
  },
  {
    from: /https:\/\/github\.com\/emn178\/online-tools/g,
    to: 'https://github.com/lowcode-apps/online-tools'
  },

  // Author meta tags
  {
    from: /<meta\s+name=["']author["']\s+content=["']emn178["']\s*\/?>/gi,
    to: '<meta name="author" content="lowcode-apps">'
  },
  {
    from: /<meta\s+name=["']copyright["']\s+content=["']emn178["']\s*\/?>/gi,
    to: '<meta name="copyright" content="lowcode-apps">'
  },
  {
    from: /<meta\s+property=["']article:author["']\s+content=["']emn178["']\s*\/?>/gi,
    to: '<meta property="article:author" content="lowcode-apps">'
  },

  // Email addresses
  {
    from: /emn178@gmail\.com/g,
    to: 'lowcode-apps@github.com'
  },

  // Direct text references
  {
    from: /\bemn178\b/g,
    to: 'lowcode-apps'
  }
];

/**
 * Remove tracking and ads from a single file
 */
async function removeTracking(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const originalLength = content.length;

  // Remove tracking patterns
  for (const pattern of TRACKING_PATTERNS) {
    const before = content.length;
    content = content.replace(pattern, '');
    if (content.length !== before) {
      modified = true;
    }
  }

  // Apply replacements
  for (const { from, to } of REPLACEMENTS) {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  }

  // Clean up multiple consecutive empty lines (left by removals)
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    const reduction = originalLength - content.length;
    return {
      modified: true,
      bytesRemoved: reduction,
      file: path.relative(ROOT_DIR, filePath)
    };
  }

  return { modified: false };
}

/**
 * Main execution
 */
async function main() {
  console.log('🧹 Removing tracking, ads, and upstream branding...\n');

  // Find all HTML files (exclude node_modules, dist, .legacy)
  const htmlFiles = await glob('**/*.html', {
    cwd: ROOT_DIR,
    ignore: ['node_modules/**', 'dist/**', '.legacy/**', '.git/**'],
    absolute: true
  });

  console.log(`Found ${htmlFiles.length} HTML files to process\n`);

  let processedCount = 0;
  let modifiedCount = 0;
  let totalBytesRemoved = 0;
  const modifiedFiles = [];

  for (const file of htmlFiles) {
    const result = await removeTracking(file);
    processedCount++;

    if (result.modified) {
      modifiedCount++;
      totalBytesRemoved += result.bytesRemoved;
      modifiedFiles.push(result.file);
      console.log(`✓ Cleaned: ${result.file} (-${result.bytesRemoved} bytes)`);
    }
  }

  // Also clean README.md and other documentation
  const docsFiles = await glob('*.md', {
    cwd: ROOT_DIR,
    absolute: true
  });

  for (const file of docsFiles) {
    const result = await removeTracking(file);
    processedCount++;

    if (result.modified) {
      modifiedCount++;
      totalBytesRemoved += result.bytesRemoved;
      modifiedFiles.push(result.file);
      console.log(`✓ Cleaned: ${result.file} (-${result.bytesRemoved} bytes)`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✨ Cleanup Complete!`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Files processed: ${processedCount}`);
  console.log(`Files modified: ${modifiedCount}`);
  console.log(`Total bytes removed: ${(totalBytesRemoved / 1024).toFixed(2)} KB`);
  console.log(`\nModified files:`);
  modifiedFiles.forEach(file => console.log(`  - ${file}`));

  // Verify no tracking remains
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 Verification`);
  console.log(`${'='.repeat(60)}`);

  const verifyPatterns = [
    { pattern: 'G-WT6N5R6W6Z', name: 'Google Analytics ID' },
    { pattern: 'ca-pub-3558414621046573', name: 'AdSense Publisher ID' },
    { pattern: 'googletagmanager.com', name: 'GTM reference' },
    { pattern: 'googlesyndication.com', name: 'AdSense reference' },
    { pattern: 'emn178.github.io', name: 'Upstream URL' },
    { pattern: 'emn178@gmail.com', name: 'Upstream email' }
  ];

  for (const { pattern, name } of verifyPatterns) {
    const results = await glob('**/*.{html,md}', {
      cwd: ROOT_DIR,
      ignore: ['node_modules/**', 'dist/**', '.legacy/**', '.git/**', '.npm-cache/**'],
      absolute: true
    });

    let found = false;
    for (const file of results) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes(pattern)) {
        console.log(`⚠️  ${name} still found in: ${path.relative(ROOT_DIR, file)}`);
        found = true;
      }
    }

    if (!found) {
      console.log(`✓ ${name}: Clean`);
    }
  }

  console.log(`\n✅ Tracking and ads successfully removed!\n`);
}

// Run
main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
