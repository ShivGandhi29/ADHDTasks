#!/usr/bin/env node
/**
 * Syncs assets/images/icon/logo.icon (icon.json + Assets/) to both iOS AppIcon.icon locations.
 * Run after updating the .icon in Icon Composer: yarn sync-icon
 */
const { cpSync, rmSync, existsSync } = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'assets/images/icon/logo.icon');
const dests = [
  path.join(root, 'ios/ADHDTasks/AppIcon.icon'),
  path.join(root, 'ios/ADHDTasks/Images.xcassets/AppIcon.icon'),
];

if (!existsSync(path.join(src, 'icon.json'))) {
  console.error('Source not found: assets/images/icon/logo.icon/icon.json');
  process.exit(1);
}

for (const dest of dests) {
  cpSync(path.join(src, 'icon.json'), path.join(dest, 'icon.json'), { force: true });
  const assetsDest = path.join(dest, 'Assets');
  if (existsSync(assetsDest)) rmSync(assetsDest, { recursive: true });
  cpSync(path.join(src, 'Assets'), assetsDest, { recursive: true });
  console.log('Synced to', path.relative(root, dest));
}

console.log('Done. Rebuild the app to see the updated icon (iOS 26 glass icon).');
