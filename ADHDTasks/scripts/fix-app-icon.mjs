#!/usr/bin/env node
/**
 * Creates an opaque 1024x1024 app icon (no alpha) for App Store requirement.
 * Run: yarn add -D sharp && node scripts/fix-app-icon.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'assets/images/iconComposer/Exported PNG image.png');
const dest = join(root, 'ios/ADHDTasks/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Run: yarn add -D sharp');
  process.exit(1);
}

const flattened = await sharp(readFileSync(src))
  .flatten({ background: '#ffffff' })
  .resize(1024, 1024)
  .png()
  .toBuffer();

writeFileSync(dest, flattened);
console.log('Wrote opaque 1024x1024 icon to', dest);
