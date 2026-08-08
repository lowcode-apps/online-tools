#!/usr/bin/env node

/**
 * Copy legacy files to dist directory after Vite build
 * This ensures all 100+ HTML tool pages and their dependencies are deployed
 */

import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Directories and files to copy
const copyTargets = [
  // Legacy HTML files (root level)
  { pattern: /\.html$/, src: '.', dest: '.', exclude: ['test-md5.html'] },

  // Legacy JavaScript
  { pattern: /.*/, src: 'js', dest: 'js' },

  // Legacy CSS
  { pattern: /.*/, src: 'css', dest: 'css' },

  // Images
  { pattern: /.*/, src: 'images', dest: 'images' },

  // Nested tool directories (contains index.html files)
  { pattern: /index\.html$/, src: 'json', dest: 'json', recursive: true },
  { pattern: /index\.html$/, src: 'xml', dest: 'xml', recursive: true },
  { pattern: /index\.html$/, src: 'aes', dest: 'aes', recursive: true },
  { pattern: /index\.html$/, src: 'des', dest: 'des', recursive: true },
  { pattern: /index\.html$/, src: 'triple-des', dest: 'triple-des', recursive: true },
  { pattern: /index\.html$/, src: 'rc4', dest: 'rc4', recursive: true },
  { pattern: /index\.html$/, src: 'chacha20', dest: 'chacha20', recursive: true },
  { pattern: /index\.html$/, src: 'chacha20-poly1305', dest: 'chacha20-poly1305', recursive: true },
  { pattern: /index\.html$/, src: 'speck', dest: 'speck', recursive: true },
  { pattern: /index\.html$/, src: 'xxtea', dest: 'xxtea', recursive: true },
  { pattern: /index\.html$/, src: 'ecdsa', dest: 'ecdsa', recursive: true },
  { pattern: /index\.html$/, src: 'rsa', dest: 'rsa', recursive: true },
  { pattern: /index\.html$/, src: 'gzip', dest: 'gzip', recursive: true },
  { pattern: /index\.html$/, src: 'deflate', dest: 'deflate', recursive: true },
  { pattern: /index\.html$/, src: 'brotli', dest: 'brotli', recursive: true },
  { pattern: /index\.html$/, src: 'zstandard', dest: 'zstandard', recursive: true },
  { pattern: /index\.html$/, src: 'xz', dest: 'xz', recursive: true },
  { pattern: /index\.html$/, src: 'lzip', dest: 'lzip', recursive: true },
  { pattern: /index\.html$/, src: 'lzma', dest: 'lzma', recursive: true },
  { pattern: /index\.html$/, src: 'zip', dest: 'zip', recursive: true },
  { pattern: /index\.html$/, src: 'tar', dest: 'tar', recursive: true },
  { pattern: /index\.html$/, src: 'hex', dest: 'hex', recursive: true },
  { pattern: /index\.html$/, src: 'base58', dest: 'base58', recursive: true },
  { pattern: /index\.html$/, src: 'cbor', dest: 'cbor', recursive: true },
  { pattern: /index\.html$/, src: 'url', dest: 'url', recursive: true },
  { pattern: /index\.html$/, src: 'jwt', dest: 'jwt', recursive: true },
  { pattern: /index\.html$/, src: 'case', dest: 'case', recursive: true },
  { pattern: /index\.html$/, src: 'converter', dest: 'converter', recursive: true },
  { pattern: /index\.html$/, src: 'generator', dest: 'generator', recursive: true },
  { pattern: /index\.html$/, src: 'qr-code', dest: 'qr-code', recursive: true },
  { pattern: /index\.html$/, src: 'text', dest: 'text', recursive: true },
  { pattern: /index\.html$/, src: 'syntax-highlight', dest: 'syntax-highlight', recursive: true },
  { pattern: /index\.html$/, src: 'crc', dest: 'crc', recursive: true },
  { pattern: /index\.html$/, src: 'crc16', dest: 'crc16', recursive: true },
  { pattern: /index\.html$/, src: 'crc32', dest: 'crc32', recursive: true },
  { pattern: /index\.html$/, src: 'adler32', dest: 'adler32', recursive: true },
  { pattern: /index\.html$/, src: 'xxhash', dest: 'xxhash', recursive: true },
  { pattern: /index\.html$/, src: 'xxhash32', dest: 'xxhash32', recursive: true },
  { pattern: /index\.html$/, src: 'xxhash64', dest: 'xxhash64', recursive: true },
  { pattern: /index\.html$/, src: 'xxhash3', dest: 'xxhash3', recursive: true },
  { pattern: /index\.html$/, src: 'xxhash128', dest: 'xxhash128', recursive: true },
  { pattern: /index\.html$/, src: 'sm3', dest: 'sm3', recursive: true },
  { pattern: /index\.html$/, src: 'whirlpool', dest: 'whirlpool', recursive: true },
  { pattern: /index\.html$/, src: 'ripemd-128', dest: 'ripemd-128', recursive: true },
  { pattern: /index\.html$/, src: 'ripemd-160', dest: 'ripemd-160', recursive: true },
  { pattern: /index\.html$/, src: 'ripemd-256', dest: 'ripemd-256', recursive: true },
  { pattern: /index\.html$/, src: 'ripemd-320', dest: 'ripemd-320', recursive: true },
  { pattern: /index\.html$/, src: 'blake2b', dest: 'blake2b', recursive: true },
  { pattern: /index\.html$/, src: 'blake2s', dest: 'blake2s', recursive: true },
  { pattern: /index\.html$/, src: 'blake3', dest: 'blake3', recursive: true },
  { pattern: /index\.html$/, src: 'hmac', dest: 'hmac', recursive: true },
  { pattern: /index\.html$/, src: 'kdf', dest: 'kdf', recursive: true },
  { pattern: /index\.html$/, src: 'bcrypt', dest: 'bcrypt', recursive: true },
  { pattern: /index\.html$/, src: 'scrypt', dest: 'scrypt', recursive: true },
  { pattern: /index\.html$/, src: 'argon2', dest: 'argon2', recursive: true },
  { pattern: /index\.html$/, src: 'shake128', dest: 'shake128', recursive: true },
  { pattern: /index\.html$/, src: 'shake256', dest: 'shake256', recursive: true },
  { pattern: /index\.html$/, src: 'cshake128', dest: 'cshake128', recursive: true },
  { pattern: /index\.html$/, src: 'cshake256', dest: 'cshake256', recursive: true },
  { pattern: /index\.html$/, src: 'kmac128', dest: 'kmac128', recursive: true },
  { pattern: /index\.html$/, src: 'kmac256', dest: 'kmac256', recursive: true },
  { pattern: /index\.html$/, src: 'kmacxof128', dest: 'kmacxof128', recursive: true },
  { pattern: /index\.html$/, src: 'kmacxof256', dest: 'kmacxof256', recursive: true },
  { pattern: /index\.html$/, src: 'tuplehash128', dest: 'tuplehash128', recursive: true },
  { pattern: /index\.html$/, src: 'tuplehash256', dest: 'tuplehash256', recursive: true },
  { pattern: /index\.html$/, src: 'tuplehashxof128', dest: 'tuplehashxof128', recursive: true },
  { pattern: /index\.html$/, src: 'tuplehashxof256', dest: 'tuplehashxof256', recursive: true },
  { pattern: /index\.html$/, src: 'parallelhash128', dest: 'parallelhash128', recursive: true },
  { pattern: /index\.html$/, src: 'parallelhash256', dest: 'parallelhash256', recursive: true },
  { pattern: /index\.html$/, src: 'parallelhashxof128', dest: 'parallelhashxof128', recursive: true },
  { pattern: /index\.html$/, src: 'parallelhashxof256', dest: 'parallelhashxof256', recursive: true }
];

function copyRecursive(srcPath, destPath, pattern, exclude = []) {
  // Create destination if it doesn't exist
  if (!existsSync(destPath)) {
    mkdirSync(destPath, { recursive: true });
  }

  // Read source directory
  const items = readdirSync(srcPath);

  for (const item of items) {
    const srcItem = join(srcPath, item);
    const destItem = join(destPath, item);

    // Skip excluded files
    if (exclude.includes(item)) {
      continue;
    }

    // Skip node_modules, .legacy, src, tests, etc.
    if (item === 'node_modules' || item === '.legacy' || item === 'src' || item === 'tests' || item === 'dist' || item.startsWith('.')) {
      continue;
    }

    const stats = statSync(srcItem);

    if (stats.isDirectory()) {
      // Recursively copy directory
      copyRecursive(srcItem, destItem, pattern, exclude);
    } else if (stats.isFile() && pattern.test(item)) {
      // Copy file if it matches pattern
      try {
        // Ensure parent directory exists
        const parentDir = dirname(destItem);
        if (!existsSync(parentDir)) {
          mkdirSync(parentDir, { recursive: true });
        }

        copyFileSync(srcItem, destItem);
        const relativePath = relative(rootDir, destItem);
        console.log(`  ✓ ${relativePath}`);
      } catch (err) {
        console.error(`  ✗ Failed to copy ${item}:`, err.message);
      }
    }
  }
}

console.log('\n📦 Copying legacy files to dist/...\n');

let totalCopied = 0;

for (const target of copyTargets) {
  const srcPath = join(rootDir, target.src);
  const destPath = join(distDir, target.dest);

  // Skip if source doesn't exist
  if (!existsSync(srcPath)) {
    continue;
  }

  if (target.recursive) {
    console.log(`Copying from ${target.src}/...`);
    copyRecursive(srcPath, destPath, target.pattern, target.exclude || []);
  } else {
    console.log(`Copying from ${target.src}/...`);
    if (!existsSync(destPath)) {
      mkdirSync(destPath, { recursive: true });
    }

    const items = readdirSync(srcPath);
    for (const item of items) {
      const srcItem = join(srcPath, item);
      const destItem = join(destPath, item);

      // Skip if excluded
      if (target.exclude && target.exclude.includes(item)) {
        continue;
      }

      const stats = statSync(srcItem);
      if (stats.isFile() && target.pattern.test(item)) {
        try {
          copyFileSync(srcItem, destItem);
          const relativePath = relative(rootDir, destItem);
          console.log(`  ✓ ${relativePath}`);
          totalCopied++;
        } catch (err) {
          console.error(`  ✗ Failed to copy ${item}:`, err.message);
        }
      }
    }
  }
}

console.log(`\n✅ Build complete! Legacy files copied to dist/\n`);
