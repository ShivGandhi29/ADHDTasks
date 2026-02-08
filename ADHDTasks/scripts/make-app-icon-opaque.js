#!/usr/bin/env node
/**
 * Flattens the iOS app icon PNGs (Light and Dark) onto opaque backgrounds so they
 * have no alpha channel. App Store validation rejects icons with transparency.
 *
 * Usage: yarn make-app-icon-opaque
 */
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const appIconSet = path.join(root, 'ios/ADHDTasks/Images.xcassets/AppIcon.appiconset');

const iconsToFlatten = [
  { file: 'App-Icon-Light-1024x1024@1x.png', background: '#ffffff' },
  { file: 'App-Icon-Dark-1024x1024@1x.png', background: '#1c1c1e' },
];

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (_) {
    console.error('This script requires "sharp". Install with: yarn add -D sharp');
    process.exit(1);
  }

  for (const { file, background } of iconsToFlatten) {
    const inputPath = path.join(appIconSet, file);
    if (!fs.existsSync(inputPath)) {
      console.warn('Skip (not found):', file);
      continue;
    }

    await sharp(inputPath)
      .flatten({ background })
      .png()
      .toFile(inputPath + '.tmp');

    fs.renameSync(inputPath + '.tmp', inputPath);
    console.log('Flattened (no alpha):', file);
  }

  console.log('Done. iOS app icons are now opaque for App Store.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
